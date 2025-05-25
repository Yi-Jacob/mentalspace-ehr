
export interface IntakeFormData {
  // Client Overview
  clientId: string;
  intakeDate: string;
  
  // Presenting Problem
  primaryProblem: string;
  additionalConcerns: string[];
  symptomOnset: string;
  symptomSeverity: string;
  detailedDescription: string;
  impactOnFunctioning: string;
  
  // Treatment History
  hasPriorTreatment: boolean;
  treatmentTypes: string[];
  treatmentDetails: string;
  treatmentEffectiveness: string;
  
  // Medical History
  medicalConditions: string;
  currentMedications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    prescriber: string;
  }>;
  medicationAllergies: string;
  familyPsychiatricHistory: string;
  
  // Substance Use
  substanceUseHistory: Record<string, {
    current: boolean;
    past: boolean;
    frequency?: string;
    amount?: string;
    notes?: string;
  }>;
  noSubstanceUse: boolean;
  
  // Risk Assessment
  riskFactors: string[];
  noAcuteRisk: boolean;
  riskDetails: string;
  safetyPlan: string;
  
  // Psychosocial
  relationshipStatus: string;
  occupation: string;
  livingSituation: string;
  socialSupport: string;
  currentStressors: string;
  strengthsCoping: string;
  
  // Diagnosis
  primaryDiagnosis: string;
  secondaryDiagnoses: string[];
  
  // Finalization
  isFinalized: boolean;
  signature: string;
  signedBy: string;
  signedAt: string;
}
