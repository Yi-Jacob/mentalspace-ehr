
export interface ProgressNoteFormData {
  clientId: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  serviceCode: string;
  location: string;
  participants: string;
  
  // Diagnosis Section
  primaryDiagnosis: string;
  secondaryDiagnoses: string[];
  
  // Current Mental Status
  orientation: string;
  generalAppearance: string;
  dress: string;
  motorActivity: string;
  interviewBehavior: string;
  speech: string;
  mood: string;
  affect: string;
  insight: string;
  judgmentImpulseControl: string;
  memory: string;
  attentionConcentration: string;
  thoughtProcess: string;
  thoughtContent: string;
  perception: string;
  functionalStatus: string;
  
  // Risk Assessment
  riskAreas: Array<{
    areaOfRisk: string;
    levelOfRisk: 'Low' | 'Medium' | 'High' | 'Imminent';
    intentToAct: 'Yes' | 'No' | 'Not Applicable';
    planToAct: 'Yes' | 'No' | 'Not Applicable';
    meansToAct: 'Yes' | 'No' | 'Not Applicable';
    riskFactors: string;
    protectiveFactors: string;
    additionalDetails: string;
  }>;
  noRiskPresent: boolean;
  
  // Medications
  medicationsContent: string;
  
  // Content Sections
  symptomDescription: string;
  objectiveContent: string;
  
  // Interventions Used
  selectedInterventions: string[];
  otherInterventions: string;
  
  // Treatment Plan Progress
  objectives: Array<{
    objectiveText: string;
    progress: string;
  }>;
  
  // Planning
  planContent: string;
  recommendation: 'Continue current therapeutic focus' | 'Change treatment goals or objectives' | 'Terminate treatment';
  prescribedFrequency: string;
  
  // Finalization
  isFinalized: boolean;
  signature: string;
  signedBy: string;
  signedAt: string;
}
