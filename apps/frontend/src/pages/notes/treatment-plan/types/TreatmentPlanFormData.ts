
export interface TreatmentPlanFormData {
  clientId: string;
  
  // Client Overview fields (matching intake form)
  treatmentPlanDate?: string;
  primaryPhone?: string;
  primaryEmail?: string;
  primaryInsurance?: string;
  cptCode?: string;
  
  // Diagnosis
  primaryDiagnosis: string;
  secondaryDiagnoses: string[];
  
  // Presenting Problem
  presentingProblem: string;
  functionalImpairments: string[];
  strengths: string[];
  
  // Treatment Goals
  treatmentGoals: Array<{
    id: string;
    goalText: string;
    objectives: Array<{
      id: string;
      text: string;
      objectiveText: string;
      targetDate: string;
      estimatedCompletion: string;
      completionDate: string;
      method: string;
      frequency: string;
      strategies: string[];
    }>;
    targetDate: string;
    priority: 'High' | 'Medium' | 'Low';
  }>;
  
  // Discharge Planning
  dischargeCriteria: string;
  estimatedDuration: string;
  aftercareRecommendations: string;
  
  // Additional Information
  additionalInformation: string;
  medicalConsiderations: string;
  psychosocialFactors: string;
  culturalConsiderations: string;
  
  // Frequency
  sessionFrequency: string;
  sessionDuration: string;
  modality: string;
  prescribedFrequency: string;
  medicalNecessityDeclaration: boolean;
  
  // Finalization
  isFinalized: boolean;
  signature: string;
  signedBy: string;
  signedAt: string;
}
