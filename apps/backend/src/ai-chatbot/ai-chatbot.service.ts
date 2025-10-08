import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { ChatRequestDto, ChatResponseDto, MessageRole } from './dto/chat-message.dto';
import { OpenAIMessage, OpenAIRequest, OpenAIResponse } from './interfaces/openai.interface';
import { AI_CHATBOT_CONFIG } from './ai-chatbot.config';

@Injectable()
export class AIChatbotService {
  private readonly logger = new Logger(AIChatbotService.name);
  private readonly openaiApiUrl = AI_CHATBOT_CONFIG.API_URL;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async processChatMessage(request: ChatRequestDto, userId: string): Promise<ChatResponseDto> {
    try {
      // Get OpenAI API key from practice settings
      const openaiApiKey = await this.getOpenAIApiKey();
      if (!openaiApiKey) {
        throw new HttpException('OpenAI API key not configured in practice settings', HttpStatus.SERVICE_UNAVAILABLE);
      }

      // Get or create chat session
      let sessionId = request.sessionId;
      if (!sessionId) {
        const session = await this.createChatSession(userId);
        sessionId = session.id;
      }

      // Get existing messages for context
      const existingSession = await this.prisma.chatSession.findUnique({
        where: { id: sessionId, userId },
      });

      if (!existingSession) {
        throw new HttpException('Chat session not found', HttpStatus.NOT_FOUND);
      }

      // Prepare messages for OpenAI - only send last N messages for performance
      const recentMessages = (existingSession.messages as unknown as OpenAIMessage[]).slice(-AI_CHATBOT_CONFIG.MAX_CONTEXT_MESSAGES);
      
      // Build system prompt with note context if available
      let systemPrompt = AI_CHATBOT_CONFIG.SYSTEM_PROMPT;
      if (request.noteContext) {
        systemPrompt += `\n\nYou are currently discussing a ${request.noteContext.noteType.replace('_', ' ')} note for client ${request.noteContext.clientName}. Here is the note content:\n\n${request.noteContext.noteContent}\n\nPlease provide helpful insights and assistance related to this specific note.`;
      }
      
      const messages: OpenAIMessage[] = [
        {
          role: 'system',
          content: systemPrompt
        },
        ...recentMessages,
        {
          role: 'user',
          content: request.message
        }
      ];

      // Call OpenAI API
      const aiResponse = await this.callOpenAI(messages, openaiApiKey);
      
      // Save the new messages to the session
      const updatedMessages = [
        ...(existingSession.messages as unknown as OpenAIMessage[]),
        { role: 'user', content: request.message },
        { role: 'assistant', content: aiResponse }
      ];

      await this.prisma.chatSession.update({
        where: { id: sessionId },
        data: {
          messages: updatedMessages,
          updatedAt: new Date()
        }
      });

      return {
        message: aiResponse,
        sessionId,
      };

    } catch (error) {
      this.logger.error('Error processing chat message:', error);
      throw new HttpException(
        'Failed to process chat message',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async createChatSession(userId: string) {
    return await this.prisma.chatSession.create({
      data: {
        userId,
        messages: [],
      }
    });
  }

  private async getOpenAIApiKey(): Promise<string | null> {
    try {
      // Get the first practice settings record (assuming single practice)
      const practiceSettings = await this.prisma.practiceSetting.findFirst();
      if (!practiceSettings) {
        this.logger.warn('No practice settings found');
        return null;
      }

      const aiSettings = practiceSettings.aiSettings as any;
      return aiSettings?.openaiApiKey || null;
    } catch (error) {
      this.logger.error('Error retrieving OpenAI API key from practice settings:', error);
      return null;
    }
  }

  private async callOpenAI(messages: OpenAIMessage[], apiKey: string): Promise<string> {
    const requestBody: OpenAIRequest = {
      model: AI_CHATBOT_CONFIG.MODEL,
      messages,
      max_tokens: AI_CHATBOT_CONFIG.MAX_TOKENS,
      temperature: AI_CHATBOT_CONFIG.TEMPERATURE,
    };

    try {
      const response = await fetch(this.openaiApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        this.logger.error('OpenAI API error:', errorData);
        throw new HttpException(
          `OpenAI API error: ${errorData.error?.message || 'Unknown error'}`,
          HttpStatus.BAD_REQUEST
        );
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    } catch (error) {
      this.logger.error('Error calling OpenAI API:', error);
      throw new HttpException(
        'Failed to communicate with AI service',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getChatHistory(sessionId: string, userId: string) {
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId, userId },
    });

    if (!session) {
      throw new HttpException('Chat session not found', HttpStatus.NOT_FOUND);
    }

    return session.messages;
  }

  async getUserChatSessions(userId: string) {
    return await this.prisma.chatSession.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        messages: true
      }
    });
  }

  async generateFormData(request: { summary: string; noteType: string; clientName: string }, userId: string) {
    try {
      // Get OpenAI API key from practice settings
      const openaiApiKey = await this.getOpenAIApiKey();
      if (!openaiApiKey) {
        throw new HttpException('OpenAI API key not configured in practice settings', HttpStatus.SERVICE_UNAVAILABLE);
      }

      // Get form schema for the note type
      const formSchema = this.getFormSchemaForNoteType(request.noteType);
      
      // Create specialized prompt for form generation
      const systemPrompt = `You are a specialized AI assistant for generating structured mental health note forms. Your task is to create comprehensive, professional form data based on a summary provided by a healthcare provider.

CRITICAL RULES:
1. Return ONLY valid JSON that matches the provided schema exactly
2. Use realistic, professional content appropriate for mental health documentation
3. Fill in all relevant fields based on the summary
4. Use appropriate medical terminology and professional language
5. Ensure dates are in YYYY-MM-DD format and times in HH:MM format
6. For fields with "options:" listed, you MUST use EXACTLY one of those values - do not create new values
7. For boolean fields, use true or false
8. For array fields, provide arrays of strings using the exact option values when specified
9. Include realistic but anonymized content
10. If a field has specific options listed, you must choose from those options only

FORM SCHEMA:
${JSON.stringify(formSchema, null, 2)}

IMPORTANT: When you see "options:" in a field description, you MUST use one of those exact values. Do not create new values or variations.

Return ONLY the JSON object, no additional text, explanations, or formatting.`;

      const userPrompt = `Generate a complete ${request.noteType.replace('_', ' ')} form for client ${request.clientName} based on this summary:

${request.summary}

Please create comprehensive form data that includes all relevant sections and fields.`;

      const messages: OpenAIMessage[] = [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ];

      // Call OpenAI API with higher token limit for form generation
      const aiResponse = await this.callOpenAIForFormGeneration(messages, openaiApiKey);
      
      // Parse and validate the JSON response
      let formData;
      try {
        // Extract JSON from the response (in case there's extra text)
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          formData = JSON.parse(jsonMatch[0]);
        } else {
          formData = JSON.parse(aiResponse);
        }
      } catch (parseError) {
        this.logger.error('Failed to parse AI response as JSON:', parseError);
        throw new HttpException('AI generated invalid JSON response', HttpStatus.BAD_REQUEST);
      }

      // Validate the form data against the schema
      this.validateFormData(formData, formSchema);

      return { formData };

    } catch (error) {
      this.logger.error('Error generating form data:', error);
      throw new HttpException(
        'Failed to generate form data',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private getFormSchemaForNoteType(noteType: string): any {
    // Define schemas for each note type based on the frontend configurations
    const schemas = {
      progress_note: {
        clientId: 'string',
        sessionDate: 'string (YYYY-MM-DD)',
        startTime: 'string (HH:MM)',
        endTime: 'string (HH:MM)',
        duration: 'number (minutes)',
        serviceCode: 'string (options: 90834, 90832, 90837, 90839, 90846, 90847, 90853, 96158, 99404, H0004, H2011, H2014, H2015)',
        location: 'string (options: office, telehealth, home, hospital, other)',
        participants: 'string (options: client-only, client-family, family-only, group)',
        primaryDiagnosis: 'string',
        secondaryDiagnoses: 'array of strings',
        orientation: 'string (options: X3: Oriented to Person Place and Time, X2: Oriented to Person Place; Impaired to Time, X2: Oriented to Person Time; Impaired to Place, X2: Oriented to Time Place; Impaired to Person, X1: Oriented to Person; Impaired to Place Time, X1: Oriented to Place; Impaired to Person Time, X1: Oriented to Time; Impaired to Person Place, X0: Impaired to Person Place and Time, Not Assessed)',
        generalAppearance: 'string (options: Well-groomed, Disheveled, Unkempt, Clean and neat, Poor hygiene, Age-appropriate, Younger than stated age, Older than stated age, Not Assessed)',
        dress: 'string (options: Appropriate, Disheveled, Emaciated, Obese, Poor Hygiene, Inappropriate for weather, Bizarre, Seductive, Not Assessed)',
        motorActivity: 'string (options: Unremarkable, Agitation, Retardation, Posturing, Repetitive actions, Tics, Tremor, Unusual Gait, Hyperactive, Hypoactive, Restless, Catatonic, Not Assessed)',
        interviewBehavior: 'string (options: Cooperative, Uncooperative, Guarded, Hostile, Evasive, Suspicious, Seductive, Manipulative, Demanding, Pleasant, Withdrawn, Not Assessed)',
        speech: 'string (options: Normal rate and rhythm, Rapid, Slow, Loud, Soft, Pressured, Monotone, Slurred, Stammering, Circumstantial, Tangential, Flight of ideas, Not Assessed)',
        mood: 'string (options: Euthymic, Depressed, Elevated, Irritable, Anxious, Angry, Euphoric, Dysphoric, Labile, Expansive, Not Assessed)',
        affect: 'string (options: Euthymic, Depressed, Elevated, Irritable, Anxious, Angry, Flat, Blunted, Labile, Inappropriate, Constricted, Expansive, Not Assessed)',
        insight: 'string (options: Excellent, Good, Fair, Poor, Nil, Not Assessed)',
        judgmentImpulseControl: 'string (options: Excellent, Good, Fair, Poor, Nil, Not Assessed)',
        memory: 'string (options: Excellent, Good, Fair, Poor, Nil, Not Assessed)',
        attentionConcentration: 'string (options: Excellent, Good, Fair, Poor, Nil, Not Assessed)',
        thoughtProcess: 'string (options: Linear, Goal-directed, Circumstantial, Tangential, Flight of ideas, Loose associations, Word salad, Thought blocking, Perseveration, Clang associations, Not Assessed)',
        thoughtContent: 'string (options: No abnormalities noted, Obsessions, Compulsions, Phobias, Suicidal ideation, Homicidal ideation, Delusions, Ideas of reference, Paranoid thoughts, Not Assessed)',
        perception: 'string (options: No abnormalities noted, Auditory hallucinations, Visual hallucinations, Tactile hallucinations, Olfactory hallucinations, Gustatory hallucinations, Illusions, Depersonalization, Derealization, Not Assessed)',
        functionalStatus: 'string (options: Independent in all activities, Mild impairment, Moderate impairment, Severe impairment, Requires assistance with ADLs, Requires supervision, Homebound, Institutionalized, Not Assessed)',
        riskAreas: 'array of strings (options: Inability to care for self, Inability to care for others, Aggression toward others, Aggression toward property, Self-harm, Suicide, Violence, Substance abuse, Elopement/Wandering, Sexual acting out, Fire setting, Other)',
        noRiskPresent: 'boolean',
        medicationsContent: 'string',
        symptomDescription: 'string',
        objectiveContent: 'string',
        selectedInterventions: 'array of strings (options: Cognitive Challenging, Cognitive Refocusing, Cognitive Reframing, Communication Skills, Compliance Issues, DBT, Exploration of Coping Patterns, Exploration of Emotions, Exploration of Relationship Patterns, Guided Imagery, Interactive Feedback, Interpersonal Resolutions, Mindfulness Training, Preventative Services, Psycho-Education, Relaxation/Deep Breathing, Review of Treatment Plan/Progress, Role-Play/Behavioral Rehearsal, Structured Problem Solving, Supportive Reflection, Symptom Management, Other)',
        otherInterventions: 'string',
        objectives: 'array of strings',
        planContent: 'string',
        recommendation: 'string (options: Continue current therapeutic focus, Change treatment goals or objectives, Terminate treatment)',
        prescribedFrequency: 'string (options: As Needed, Twice a Week, Weekly, Every 2 Weeks, Every 4 Weeks, Every Month, Every 2 Months, Every 3 Months, Every 4 Months)',
        isFinalized: 'boolean',
        signature: 'string',
        signedBy: 'string',
        signedAt: 'string'
      },
      treatment_plan: {
        clientId: 'string',
        primaryDiagnosis: 'string',
        secondaryDiagnoses: 'array of strings',
        presentingProblem: 'string',
        functionalImpairments: 'array of strings',
        strengths: 'array of strings',
        treatmentGoals: 'array of strings',
        dischargeCriteria: 'string',
        estimatedDuration: 'string (options: 3 months, 6 months, 9 months, 12 months)',
        aftercareRecommendations: 'string',
        additionalInformation: 'string',
        medicalConsiderations: 'string',
        psychosocialFactors: 'string',
        culturalConsiderations: 'string',
        sessionFrequency: 'string (options: Weekly, Bi-weekly, Monthly, As needed, Other)',
        sessionDuration: 'string (options: 30 minutes, 45 minutes, 60 minutes, 90 minutes, Other)',
        modality: 'string (options: Individual Therapy, Group Therapy, Family Therapy, Couples Therapy, Telehealth, Other)',
        prescribedFrequency: 'string (options: As Needed, Twice a Week, Weekly, Every 2 Weeks, Every 4 Weeks, Every Month, Every 2 Months, Every 3 Months, Every 4 Months)',
        medicalNecessityDeclaration: 'boolean',
        isFinalized: 'boolean',
        signature: 'string',
        signedBy: 'string',
        signedAt: 'string'
      },
      intake: {
        clientId: 'string',
        intakeDate: 'string (YYYY-MM-DD)',
        primaryPhone: 'string',
        primaryEmail: 'string',
        primaryInsurance: 'string',
        cptCode: 'string (options: 021701, 021702, 90791, 96156)',
        primaryProblem: 'string (options: Anxiety, Depression, Trauma / PTSD, Stress Management, Relationship Issues, Grief / Loss, Anger Management, Substance Use / Addiction, Behavioral Issues, Bipolar Symptoms, Psychosis / Schizophrenia, Eating Disorder Concerns, Personality Disorder Concerns, Sexual / Gender Identity Concerns, Other)',
        additionalConcerns: 'array of strings',
        symptomOnset: 'string (options: Recent (Less than 1 month), Acute (1-3 months), Subacute (3-6 months), Chronic (6+ months), Episodic (Comes and goes), Longstanding (Years), Since childhood, Unknown / Not specified)',
        symptomSeverity: 'string (options: Mild, Moderate, Severe, Extreme, Fluctuating)',
        detailedDescription: 'string',
        impactOnFunctioning: 'string',
        hasPriorTreatment: 'boolean',
        treatmentTypes: 'array of strings (options: Individual Therapy, Group Therapy, Family Therapy, Couples Therapy, Psychiatric Medication, Substance Abuse Treatment, Inpatient Hospitalization, Partial Hospitalization (PHP), Intensive Outpatient Program (IOP), Support Group, Other)',
        treatmentDetails: 'string',
        treatmentEffectiveness: 'string',
        medicalConditions: 'string',
        currentMedications: 'array of strings',
        medicationAllergies: 'string',
        familyPsychiatricHistory: 'string',
        substanceUseHistory: 'object',
        noSubstanceUse: 'boolean',
        riskFactors: 'array of strings (options: Current Suicidal Ideation, History of Suicide Attempt(s), Homicidal Ideation, Self-Harm Behaviors, Significant Impulsivity, Aggression/Violence History)',
        noAcuteRisk: 'boolean',
        riskDetails: 'string',
        safetyPlan: 'string',
        relationshipStatus: 'string (options: Single, Married, Divorced, Separated, Widowed, In a relationship, Engaged, Other)',
        occupation: 'string',
        livingSituation: 'string (options: Own home/apartment, Rental home/apartment, Living with family, Living with friends, Group home, Homeless, Institution, Other)',
        socialSupport: 'string',
        currentStressors: 'string',
        strengthsCoping: 'string',
        primaryDiagnosis: 'string',
        secondaryDiagnoses: 'array of strings',
        signature: 'string',
        signedBy: 'string',
        signedAt: 'string'
      },
      contact_note: {
        clientId: 'string',
        noteDate: 'string (YYYY-MM-DD)',
        contactDate: 'string (YYYY-MM-DD)',
        contactTime: 'string (HH:MM)',
        contactType: 'string (options: phone, email, text, video_call, in_person, collateral)',
        contactInitiator: 'string (options: client, provider, family, other_provider, emergency)',
        contactDuration: 'number (minutes)',
        contactPurpose: 'array of strings',
        contactSummary: 'string',
        clientMoodStatus: 'string',
        riskFactorsDiscussed: 'boolean',
        riskDetails: 'string',
        interventionsProvided: 'array of strings',
        resourcesProvided: 'array of strings',
        followUpRequired: 'boolean',
        followUpPlan: 'string',
        nextAppointmentScheduled: 'boolean',
        nextAppointmentDate: 'string (YYYY-MM-DD)',
        clinicalObservations: 'string',
        providerRecommendations: 'string',
        signature: 'string',
        isFinalized: 'boolean'
      },
      consultation_note: {
        clientId: 'string',
        noteDate: 'string (YYYY-MM-DD)',
        consultationDate: 'string (YYYY-MM-DD)',
        consultationTime: 'string (HH:MM)',
        consultationType: 'string (options: case_review, treatment_planning, supervision, peer_consultation, multidisciplinary_team)',
        consultationPurpose: 'string',
        consultationDuration: 'number (minutes)',
        participants: 'array of strings',
        presentingConcerns: 'string',
        backgroundInformation: 'string',
        currentTreatment: 'string',
        discussionPoints: 'array of strings',
        consultantRecommendations: 'array of strings',
        agreedUponActions: 'array of strings',
        treatmentModifications: 'string',
        additionalResources: 'array of strings',
        followUpRequired: 'boolean',
        followUpPlan: 'string',
        nextConsultationDate: 'string (YYYY-MM-DD)',
        actionItemOwners: 'array of strings',
        confidentialityAgreement: 'boolean',
        consentObtained: 'boolean',
        signature: 'string',
        isFinalized: 'boolean'
      },
      miscellaneous_note: {
        clientId: 'string',
        noteDate: 'string (YYYY-MM-DD)',
        eventDate: 'string (YYYY-MM-DD)',
        noteCategory: 'string (options: administrative, legal, insurance, coordination_of_care, incident_report, other)',
        noteSubtype: 'string',
        urgencyLevel: 'string (options: low, medium, high, urgent)',
        noteTitle: 'string',
        noteDescription: 'string',
        detailedNotes: 'string',
        relatedPersons: 'array of strings',
        documentsReferenced: 'array of strings',
        actionsTaken: 'array of strings',
        followUpRequired: 'boolean',
        followUpDetails: 'string',
        mandatoryReporting: 'boolean',
        reportingDetails: 'string',
        legalImplications: 'string',
        resolution: 'string',
        outcomeSummary: 'string',
        signature: 'string',
        isFinalized: 'boolean'
      },
      cancellation_note: {
        clientId: 'string',
        noteDate: 'string (YYYY-MM-DD)',
        appointmentDate: 'string (YYYY-MM-DD)',
        appointmentTime: 'string (HH:MM)',
        cancellationDate: 'string (YYYY-MM-DD)',
        cancellationTime: 'string (HH:MM)',
        cancellationInitiator: 'string (options: client, provider, emergency, system)',
        notificationMethod: 'string (options: phone, email, text, in_person, no_show)',
        cancellationReason: 'string',
        rescheduled: 'boolean',
        newAppointmentDate: 'string (YYYY-MM-DD)',
        newAppointmentTime: 'string (HH:MM)',
        billingStatus: 'string (options: not_billed, billed, partial_charge, pending_review)',
        billingNotes: 'string',
        signature: 'string',
        isFinalized: 'boolean'
      }
    };

    return schemas[noteType] || {};
  }

  private async callOpenAIForFormGeneration(messages: OpenAIMessage[], apiKey: string): Promise<string> {
    const requestBody: OpenAIRequest = {
      model: AI_CHATBOT_CONFIG.MODEL,
      messages,
      max_tokens: 4000, // Higher token limit for form generation
      temperature: 0.3, // Lower temperature for more consistent output
    };

    try {
      const response = await fetch(this.openaiApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        this.logger.error('OpenAI API error:', errorData);
        throw new HttpException(
          `OpenAI API error: ${errorData.error?.message || 'Unknown error'}`,
          HttpStatus.BAD_REQUEST
        );
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0]?.message?.content || '';

    } catch (error) {
      this.logger.error('Error calling OpenAI API for form generation:', error);
      throw new HttpException(
        'Failed to communicate with AI service',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private validateFormData(formData: any, schema: any): void {
    // Basic validation to ensure required fields are present
    const requiredFields = Object.keys(schema);
    const missingFields = requiredFields.filter(field => !(field in formData));
    
    if (missingFields.length > 0) {
      this.logger.warn(`Missing fields in generated form data: ${missingFields.join(', ')}`);
    }

    // Validate enum/option values
    for (const [field, fieldSchema] of Object.entries(schema)) {
      if (typeof fieldSchema === 'string' && fieldSchema.includes('options:')) {
        const optionsMatch = fieldSchema.match(/options:\s*([^)]+)/);
        if (optionsMatch && formData[field]) {
          const options = optionsMatch[1].split(',').map(opt => opt.trim());
          const value = formData[field];
          
          if (Array.isArray(value)) {
            // For array fields, validate each item
            const invalidItems = value.filter(item => !options.includes(item));
            if (invalidItems.length > 0) {
              this.logger.warn(`Invalid values in field ${field}: ${invalidItems.join(', ')}. Valid options: ${options.join(', ')}`);
            }
          } else {
            // For single value fields
            if (!options.includes(value)) {
              this.logger.warn(`Invalid value for field ${field}: ${value}. Valid options: ${options.join(', ')}`);
            }
          }
        }
      }
    }
  }
}
