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

IMPORTANT RULES:
1. Return ONLY valid JSON that matches the provided schema exactly
2. Use realistic, professional content appropriate for mental health documentation
3. Fill in all relevant fields based on the summary
4. Use appropriate medical terminology and professional language
5. Ensure dates are in YYYY-MM-DD format
6. Use appropriate values for dropdowns and selections
7. Include realistic but anonymized content

FORM SCHEMA:
${JSON.stringify(formSchema, null, 2)}

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
        serviceCode: 'string',
        location: 'string',
        participants: 'string',
        primaryDiagnosis: 'string',
        secondaryDiagnoses: 'array of strings',
        orientation: 'string',
        generalAppearance: 'string',
        dress: 'string',
        motorActivity: 'string',
        interviewBehavior: 'string',
        speech: 'string',
        mood: 'string',
        affect: 'string',
        insight: 'string',
        judgmentImpulseControl: 'string',
        memory: 'string',
        attentionConcentration: 'string',
        thoughtProcess: 'string',
        thoughtContent: 'string',
        perception: 'string',
        functionalStatus: 'string',
        riskAreas: 'array of strings',
        noRiskPresent: 'boolean',
        medicationsContent: 'string',
        symptomDescription: 'string',
        objectiveContent: 'string',
        selectedInterventions: 'array of strings',
        otherInterventions: 'string',
        objectives: 'array of strings',
        planContent: 'string',
        recommendation: 'string',
        prescribedFrequency: 'string',
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
        estimatedDuration: 'string',
        aftercareRecommendations: 'string',
        additionalInformation: 'string',
        medicalConsiderations: 'string',
        psychosocialFactors: 'string',
        culturalConsiderations: 'string',
        sessionFrequency: 'string',
        sessionDuration: 'string',
        modality: 'string',
        prescribedFrequency: 'string',
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
        cptCode: 'string',
        primaryProblem: 'string',
        additionalConcerns: 'array of strings',
        symptomOnset: 'string',
        symptomSeverity: 'string',
        detailedDescription: 'string',
        impactOnFunctioning: 'string',
        hasPriorTreatment: 'boolean',
        treatmentTypes: 'array of strings',
        treatmentDetails: 'string',
        treatmentEffectiveness: 'string',
        medicalConditions: 'string',
        currentMedications: 'array of strings',
        medicationAllergies: 'string',
        familyPsychiatricHistory: 'string',
        substanceUseHistory: 'object',
        noSubstanceUse: 'boolean',
        riskFactors: 'array of strings',
        noAcuteRisk: 'boolean',
        riskDetails: 'string',
        safetyPlan: 'string',
        relationshipStatus: 'string',
        occupation: 'string',
        livingSituation: 'string',
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
        contactType: 'string',
        contactInitiator: 'string',
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
        consultationType: 'string',
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
        noteCategory: 'string',
        noteSubtype: 'string',
        urgencyLevel: 'string',
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
        cancellationInitiator: 'string',
        notificationMethod: 'string',
        cancellationReason: 'string',
        rescheduled: 'boolean',
        newAppointmentDate: 'string (YYYY-MM-DD)',
        newAppointmentTime: 'string (HH:MM)',
        billingStatus: 'string',
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
  }
}
