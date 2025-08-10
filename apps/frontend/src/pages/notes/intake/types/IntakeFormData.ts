export interface IntakeFormData {
  clientId: string;
  intakeDate: string;
  primaryPhone: string; // Now stores the clientPhoneNumber.id
  primaryEmail: string;
  primaryInsurance: string; // Now stores the clientInsurance.id
  cptCode: string;
  primaryProblem: string;
  additionalConcerns: string[];
  symptomOnset: string;
  symptomSeverity: string;
  detailedDescription: string;
  impactOnFunctioning: string;
  hasPriorTreatment: boolean;
  treatmentTypes: string[];
  treatmentDetails: string;
  treatmentEffectiveness: string;
  medicalConditions: string;
  currentMedications: string[];
  medicationAllergies: string;
  familyPsychiatricHistory: string;
  substanceUseHistory: Record<string, any>;
  noSubstanceUse: boolean;
  riskFactors: string[];
  noAcuteRisk: boolean;
  riskDetails: string;
  safetyPlan: string;
  relationshipStatus: string;
  occupation: string;
  livingSituation: string;
  socialSupport: string;
  currentStressors: string;
  strengthsCoping: string;
  primaryDiagnosis: string;
  secondaryDiagnoses: string[];
  isFinalized: boolean;
  signature: string;
  signedBy: string;
  signedAt: string;
}