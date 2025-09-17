import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { InfoDisplay, InfoSection } from '@/components/basic/InfoDisplay';
import { Badge } from '@/components/basic/badge';
import { 
  UserPlus, 
  User, 
  AlertTriangle, 
  CheckCircle, 
  Calendar, 
  FileText, 
  Heart,
  Pill,
  Shield,
  Brain,
  Users,
  Stethoscope
} from 'lucide-react';
import { format } from 'date-fns';
import { 
  PRESENTING_PROBLEMS, 
  SYMPTOM_ONSET_OPTIONS, 
  SYMPTOM_SEVERITY_OPTIONS,
  RELATIONSHIP_STATUS_OPTIONS,
  LIVING_SITUATION_OPTIONS,
  TREATMENT_TYPES,
  SUBSTANCES,
  RISK_FACTORS
} from '@/types/enums/notesEnum';

interface IntakeAssessmentViewProps {
  noteData: any;
}

const IntakeAssessmentView: React.FC<IntakeAssessmentViewProps> = ({ noteData }) => {
  const formData = noteData.content;

  const getPresentingProblemLabel = (value: string) => {
    const problem = PRESENTING_PROBLEMS.find(p => p.value === value);
    return problem ? problem.label : value;
  };

  const getSymptomOnsetLabel = (value: string) => {
    const onset = SYMPTOM_ONSET_OPTIONS.find(o => o.value === value);
    return onset ? onset.label : value;
  };

  const getSymptomSeverityLabel = (value: string) => {
    const severity = SYMPTOM_SEVERITY_OPTIONS.find(s => s.value === value);
    return severity ? severity.label : value;
  };

  const getRelationshipStatusLabel = (value: string) => {
    const status = RELATIONSHIP_STATUS_OPTIONS.find(r => r.value === value);
    return status ? status.label : value;
  };

  const getLivingSituationLabel = (value: string) => {
    const situation = LIVING_SITUATION_OPTIONS.find(l => l.value === value);
    return situation ? situation.label : value;
  };

  const getTreatmentTypeLabel = (value: string) => {
    const type = TREATMENT_TYPES.find(t => t.value === value);
    return type ? type.label : value;
  };

  const getRiskFactorLabel = (value: string) => {
    const factor = RISK_FACTORS.find(r => r.value === value);
    return factor ? factor.label : value;
  };

  return (
    <>
      {/* Client Overview Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Client Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InfoSection title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoDisplay 
                label="Intake Date" 
                value={formData.intakeDate ? format(new Date(formData.intakeDate), 'PPP') : null} 
              />
              <InfoDisplay 
                label="Primary Phone" 
                value={formData.primaryPhone} 
              />
              <InfoDisplay 
                label="Primary Email" 
                value={formData.primaryEmail} 
              />
              <InfoDisplay 
                label="Primary Insurance" 
                value={formData.primaryInsurance} 
              />
              <InfoDisplay 
                label="CPT Code" 
                value={formData.cptCode} 
              />
            </div>
          </InfoSection>
        </CardContent>
      </Card>

      {/* Presenting Problem Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Presenting Problem
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InfoSection title="Problem Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoDisplay 
                label="Primary Problem" 
                value={getPresentingProblemLabel(formData.primaryProblem)} 
              />
              <InfoDisplay 
                label="Symptom Onset" 
                value={getSymptomOnsetLabel(formData.symptomOnset)} 
              />
              <InfoDisplay 
                label="Symptom Severity" 
                value={getSymptomSeverityLabel(formData.symptomSeverity)} 
              />
              {formData.additionalConcerns && formData.additionalConcerns.length > 0 && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Additional Concerns</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formData.additionalConcerns.map((concern, index) => (
                      <Badge key={index} variant="outline">{concern}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </InfoSection>
          
          {formData.detailedDescription && (
            <InfoSection title="Detailed Description">
              <div className="grid grid-cols-1 gap-6">
                <InfoDisplay 
                  label="Description" 
                  value={formData.detailedDescription} 
                />
              </div>
            </InfoSection>
          )}

          {formData.impactOnFunctioning && (
            <InfoSection title="Impact on Functioning">
              <div className="grid grid-cols-1 gap-6">
                <InfoDisplay 
                  label="Functional Impact" 
                  value={formData.impactOnFunctioning} 
                />
              </div>
            </InfoSection>
          )}
        </CardContent>
      </Card>

      {/* Treatment History Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-green-600" />
            Treatment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InfoSection title="Previous Treatment">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoDisplay 
                label="Has Prior Treatment" 
                value={formData.hasPriorTreatment ? 'Yes' : 'No'} 
              />
              {formData.hasPriorTreatment && formData.treatmentTypes && formData.treatmentTypes.length > 0 && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Treatment Types</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formData.treatmentTypes.map((type, index) => (
                      <Badge key={index} variant="outline">{getTreatmentTypeLabel(type)}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {formData.treatmentDetails && (
                <div className="md:col-span-2">
                  <InfoDisplay 
                    label="Treatment Details" 
                    value={formData.treatmentDetails} 
                  />
                </div>
              )}
              {formData.treatmentEffectiveness && (
                <div className="md:col-span-2">
                  <InfoDisplay 
                    label="Treatment Effectiveness" 
                    value={formData.treatmentEffectiveness} 
                  />
                </div>
              )}
            </div>
          </InfoSection>
        </CardContent>
      </Card>

      {/* Medical History Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-600" />
            Medical & Psychiatric History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InfoSection title="Medical Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.medicalConditions && (
                <div className="md:col-span-2">
                  <InfoDisplay 
                    label="Medical Conditions" 
                    value={formData.medicalConditions} 
                  />
                </div>
              )}
              {formData.medicationAllergies && (
                <div className="md:col-span-2">
                  <InfoDisplay 
                    label="Medication Allergies" 
                    value={formData.medicationAllergies} 
                  />
                </div>
              )}
              {formData.familyPsychiatricHistory && (
                <div className="md:col-span-2">
                  <InfoDisplay 
                    label="Family Psychiatric History" 
                    value={formData.familyPsychiatricHistory} 
                  />
                </div>
              )}
            </div>
          </InfoSection>

          {/* Current Medications */}
          {formData.currentMedications && formData.currentMedications.length > 0 && (
            <InfoSection title="Current Medications">
              <div className="space-y-4">
                {formData.currentMedications.map((medication, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InfoDisplay 
                        label="Medication Name" 
                        value={medication.name} 
                      />
                      <InfoDisplay 
                        label="Dosage" 
                        value={medication.dosage} 
                      />
                      <InfoDisplay 
                        label="Frequency" 
                        value={medication.frequency} 
                      />
                      <InfoDisplay 
                        label="Prescriber" 
                        value={medication.prescriber} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </InfoSection>
          )}
        </CardContent>
      </Card>

      {/* Substance Use Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-purple-600" />
            Substance Use History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InfoSection title="Substance Use Assessment">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoDisplay 
                label="No Substance Use Reported" 
                value={formData.noSubstanceUse ? 'Yes' : 'No'} 
              />
            </div>
          </InfoSection>

          {!formData.noSubstanceUse && formData.substanceUseHistory && Object.keys(formData.substanceUseHistory).length > 0 && (
            <InfoSection title="Substance Details">
              <div className="space-y-4">
                {Object.entries(formData.substanceUseHistory).map(([substance, data]: [string, any]) => {
                  const substanceInfo = SUBSTANCES.find(s => s.value === substance);
                  if (!data.current && !data.past) return null;
                  
                  return (
                    <div key={substance} className="border rounded-lg p-4 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoDisplay 
                          label="Substance" 
                          value={substanceInfo?.label || substance} 
                        />
                        <InfoDisplay 
                          label="Current Use" 
                          value={data.current ? 'Yes' : 'No'} 
                        />
                        <InfoDisplay 
                          label="Past Use" 
                          value={data.past ? 'Yes' : 'No'} 
                        />
                        {data.frequency && (
                          <InfoDisplay 
                            label="Frequency" 
                            value={data.frequency} 
                          />
                        )}
                        {data.amount && (
                          <InfoDisplay 
                            label="Amount" 
                            value={data.amount} 
                          />
                        )}
                        {data.notes && (
                          <div className="md:col-span-2">
                            <InfoDisplay 
                              label="Additional Notes" 
                              value={data.notes} 
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </InfoSection>
          )}
        </CardContent>
      </Card>

      {/* Risk Assessment Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-600" />
            Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InfoSection title="Risk Factors">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoDisplay 
                label="No Acute Risk" 
                value={formData.noAcuteRisk ? 'Yes' : 'No'} 
              />
              {formData.riskFactors && formData.riskFactors.length > 0 && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Identified Risk Factors</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formData.riskFactors.map((factor, index) => (
                      <Badge key={index} variant="destructive">{getRiskFactorLabel(factor)}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </InfoSection>

          {formData.riskDetails && (
            <InfoSection title="Risk Assessment Details">
              <div className="grid grid-cols-1 gap-6">
                <InfoDisplay 
                  label="Risk Details" 
                  value={formData.riskDetails} 
                />
              </div>
            </InfoSection>
          )}

          {formData.safetyPlan && (
            <InfoSection title="Safety Plan">
              <div className="grid grid-cols-1 gap-6">
                <InfoDisplay 
                  label="Safety Plan" 
                  value={formData.safetyPlan} 
                />
              </div>
            </InfoSection>
          )}
        </CardContent>
      </Card>

      {/* Psychosocial Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-600" />
            Psychosocial Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InfoSection title="Social & Personal Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoDisplay 
                label="Relationship Status" 
                value={getRelationshipStatusLabel(formData.relationshipStatus)} 
              />
              <InfoDisplay 
                label="Living Situation" 
                value={getLivingSituationLabel(formData.livingSituation)} 
              />
              {formData.occupation && (
                <div className="md:col-span-2">
                  <InfoDisplay 
                    label="Occupation/Employment" 
                    value={formData.occupation} 
                  />
                </div>
              )}
              {formData.socialSupport && (
                <div className="md:col-span-2">
                  <InfoDisplay 
                    label="Social Support System" 
                    value={formData.socialSupport} 
                  />
                </div>
              )}
              {formData.currentStressors && (
                <div className="md:col-span-2">
                  <InfoDisplay 
                    label="Current Stressors" 
                    value={formData.currentStressors} 
                  />
                </div>
              )}
              {formData.strengthsCoping && (
                <div className="md:col-span-2">
                  <InfoDisplay 
                    label="Strengths & Coping Skills" 
                    value={formData.strengthsCoping} 
                  />
                </div>
              )}
            </div>
          </InfoSection>
        </CardContent>
      </Card>

      {/* Diagnosis Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            Clinical Diagnosis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InfoSection title="Diagnostic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.primaryDiagnosis && (
                <div className="md:col-span-2">
                  <InfoDisplay 
                    label="Primary Diagnosis" 
                    value={formData.primaryDiagnosis} 
                  />
                </div>
              )}
              {formData.secondaryDiagnoses && formData.secondaryDiagnoses.length > 0 && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Secondary Diagnoses</label>
                  <div className="space-y-1 mt-1">
                    {formData.secondaryDiagnoses.map((diagnosis, index) => (
                      <p key={index} className="text-gray-900">{diagnosis}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </InfoSection>
        </CardContent>
      </Card>
    </>
  );
};

export default IntakeAssessmentView;
