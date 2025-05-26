
export interface TreatmentPlanFormData {
  clientId: string;
  
  // Diagnosis Section
  primaryDiagnosis: string;
  secondaryDiagnoses: string[];
  
  // Presenting Problem
  presentingProblem: string;
  
  // Treatment Goals
  treatmentGoals: Array<{
    goalText: string;
    objectives: Array<{
      objectiveText: string;
      estimatedCompletion: string;
      completionDate: string;
      strategies: string[];
    }>;
  }>;
  
  // Discharge Criteria/Planning
  dischargeCriteria: string;
  
  // Additional Information
  additionalInformation: string;
  
  // Frequency of Treatment
  prescribedFrequency: string;
  medicalNecessityDeclaration: boolean;
  
  // Finalization
  isFinalized: boolean;
  signature: string;
  signedBy: string;
  signedAt: string;
}
