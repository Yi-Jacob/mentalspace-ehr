import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { InfoDisplay, InfoSection } from '@/components/basic/InfoDisplay';
import { Badge } from '@/components/basic/badge';
import { 
  FileText, 
  User, 
  Calendar, 
  Clock, 
  MapPin, 
  Stethoscope,
  Brain,
  Shield,
  Pill,
  MessageSquare,
  Target,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { 
  RECOMMENDATION_OPTIONS, 
  PRESCRIBED_FREQUENCY_OPTIONS,
  LOCATION_OPTIONS,
  PARTICIPANT_OPTIONS,
  ORIENTATION_OPTIONS,
  GENERAL_APPEARANCE_OPTIONS,
  DRESS_OPTIONS,
  MOTOR_ACTIVITY_OPTIONS,
  INTERVIEW_BEHAVIOR_OPTIONS,
  SPEECH_OPTIONS,
  MOOD_OPTIONS,
  AFFECT_OPTIONS,
  INSIGHT_OPTIONS,
  JUDGMENT_OPTIONS,
  MEMORY_OPTIONS,
  ATTENTION_OPTIONS,
  THOUGHT_PROCESS_OPTIONS,
  THOUGHT_CONTENT_OPTIONS,
  PERCEPTION_OPTIONS,
  FUNCTIONAL_STATUS_OPTIONS,
  AREA_OF_RISK_OPTIONS,
  INTENT_TO_ACT_OPTIONS
} from '@/types/enums/notesEnum';

interface ProgressNoteViewProps {
  noteData: any;
}

const ProgressNoteView: React.FC<ProgressNoteViewProps> = ({ noteData }) => {
  const formData = noteData.content;

  const getLocationLabel = (value: string) => {
    const location = LOCATION_OPTIONS.find(l => l.value === value);
    return location ? location.label : value;
  };

  const getParticipantLabel = (value: string) => {
    const participant = PARTICIPANT_OPTIONS.find(p => p.value === value);
    return participant ? participant.label : value;
  };

  const getMentalStatusLabel = (value: string, options: any[]) => {
    const option = options.find(o => o.value === value);
    return option ? option.label : value;
  };

  const getRecommendationLabel = (value: string) => {
    const recommendation = RECOMMENDATION_OPTIONS.find(r => r.value === value);
    return recommendation ? recommendation.label : value;
  };

  const getPrescribedFrequencyLabel = (value: string) => {
    const frequency = PRESCRIBED_FREQUENCY_OPTIONS.find(f => f.value === value);
    return frequency ? frequency.label : value;
  };

  const getAreaOfRiskLabel = (value: string) => {
    const area = AREA_OF_RISK_OPTIONS.find(a => a.value === value);
    return area ? area.label : value;
  };

  const getIntentToActLabel = (value: string) => {
    const intent = INTENT_TO_ACT_OPTIONS.find(i => i.value === value);
    return intent ? intent.label : value;
  };

  return (
    <>
      {/* Session Overview Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Session Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InfoSection title="Session Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoDisplay 
                label="Session Date" 
                value={formData.sessionDate ? format(new Date(formData.sessionDate), 'PPP') : null} 
              />
              <InfoDisplay 
                label="Start Time" 
                value={formData.startTime} 
              />
              <InfoDisplay 
                label="End Time" 
                value={formData.endTime} 
              />
              <InfoDisplay 
                label="Duration" 
                value={formData.duration ? `${formData.duration} minutes` : null} 
              />
              <InfoDisplay 
                label="Service Code" 
                value={formData.serviceCode} 
              />
              <InfoDisplay 
                label="Location" 
                value={getLocationLabel(formData.location)} 
              />
              <InfoDisplay 
                label="Participants" 
                value={getParticipantLabel(formData.participants)} 
              />
            </div>
          </InfoSection>
        </CardContent>
      </Card>

      {/* Diagnosis Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-green-600" />
            Diagnosis Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InfoSection title="Clinical Diagnosis">
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

      {/* Current Mental Status Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Current Mental Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InfoSection title="Mental Status Examination">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.orientation && (
                <InfoDisplay 
                  label="Orientation" 
                  value={getMentalStatusLabel(formData.orientation, ORIENTATION_OPTIONS)} 
                />
              )}
              {formData.generalAppearance && (
                <InfoDisplay 
                  label="General Appearance" 
                  value={getMentalStatusLabel(formData.generalAppearance, GENERAL_APPEARANCE_OPTIONS)} 
                />
              )}
              {formData.dress && (
                <InfoDisplay 
                  label="Dress" 
                  value={getMentalStatusLabel(formData.dress, DRESS_OPTIONS)} 
                />
              )}
              {formData.motorActivity && (
                <InfoDisplay 
                  label="Motor Activity" 
                  value={getMentalStatusLabel(formData.motorActivity, MOTOR_ACTIVITY_OPTIONS)} 
                />
              )}
              {formData.interviewBehavior && (
                <InfoDisplay 
                  label="Interview Behavior" 
                  value={getMentalStatusLabel(formData.interviewBehavior, INTERVIEW_BEHAVIOR_OPTIONS)} 
                />
              )}
              {formData.speech && (
                <InfoDisplay 
                  label="Speech" 
                  value={getMentalStatusLabel(formData.speech, SPEECH_OPTIONS)} 
                />
              )}
              {formData.mood && (
                <InfoDisplay 
                  label="Mood" 
                  value={getMentalStatusLabel(formData.mood, MOOD_OPTIONS)} 
                />
              )}
              {formData.affect && (
                <InfoDisplay 
                  label="Affect" 
                  value={getMentalStatusLabel(formData.affect, AFFECT_OPTIONS)} 
                />
              )}
              {formData.insight && (
                <InfoDisplay 
                  label="Insight" 
                  value={getMentalStatusLabel(formData.insight, INSIGHT_OPTIONS)} 
                />
              )}
              {formData.judgmentImpulseControl && (
                <InfoDisplay 
                  label="Judgment & Impulse Control" 
                  value={getMentalStatusLabel(formData.judgmentImpulseControl, JUDGMENT_OPTIONS)} 
                />
              )}
              {formData.memory && (
                <InfoDisplay 
                  label="Memory" 
                  value={getMentalStatusLabel(formData.memory, MEMORY_OPTIONS)} 
                />
              )}
              {formData.attentionConcentration && (
                <InfoDisplay 
                  label="Attention & Concentration" 
                  value={getMentalStatusLabel(formData.attentionConcentration, ATTENTION_OPTIONS)} 
                />
              )}
              {formData.thoughtProcess && (
                <InfoDisplay 
                  label="Thought Process" 
                  value={getMentalStatusLabel(formData.thoughtProcess, THOUGHT_PROCESS_OPTIONS)} 
                />
              )}
              {formData.thoughtContent && (
                <InfoDisplay 
                  label="Thought Content" 
                  value={getMentalStatusLabel(formData.thoughtContent, THOUGHT_CONTENT_OPTIONS)} 
                />
              )}
              {formData.perception && (
                <InfoDisplay 
                  label="Perception" 
                  value={getMentalStatusLabel(formData.perception, PERCEPTION_OPTIONS)} 
                />
              )}
              {formData.functionalStatus && (
                <InfoDisplay 
                  label="Functional Status" 
                  value={getMentalStatusLabel(formData.functionalStatus, FUNCTIONAL_STATUS_OPTIONS)} 
                />
              )}
            </div>
          </InfoSection>
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
          <InfoSection title="Risk Evaluation">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoDisplay 
                label="No Risk Present" 
                value={formData.noRiskPresent ? 'Yes' : 'No'} 
              />
            </div>
          </InfoSection>

          {formData.riskAreas && formData.riskAreas.length > 0 && (
            <InfoSection title="Risk Areas">
              <div className="space-y-4">
                {formData.riskAreas.map((risk, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-red-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InfoDisplay 
                        label="Area of Risk" 
                        value={getAreaOfRiskLabel(risk.areaOfRisk)} 
                      />
                      <InfoDisplay 
                        label="Level of Risk" 
                        value={risk.levelOfRisk} 
                      />
                      <InfoDisplay 
                        label="Intent to Act" 
                        value={getIntentToActLabel(risk.intentToAct)} 
                      />
                      <InfoDisplay 
                        label="Plan to Act" 
                        value={getIntentToActLabel(risk.planToAct)} 
                      />
                      <InfoDisplay 
                        label="Means to Act" 
                        value={getIntentToActLabel(risk.meansToAct)} 
                      />
                      {risk.riskFactors && (
                        <div className="md:col-span-2">
                          <InfoDisplay 
                            label="Risk Factors" 
                            value={risk.riskFactors} 
                          />
                        </div>
                      )}
                      {risk.protectiveFactors && (
                        <div className="md:col-span-2">
                          <InfoDisplay 
                            label="Protective Factors" 
                            value={risk.protectiveFactors} 
                          />
                        </div>
                      )}
                      {risk.additionalDetails && (
                        <div className="md:col-span-2">
                          <InfoDisplay 
                            label="Additional Details" 
                            value={risk.additionalDetails} 
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </InfoSection>
          )}
        </CardContent>
      </Card>

      {/* Medications Section */}
      {formData.medicationsContent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-indigo-600" />
              Medications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InfoSection title="Medication Information">
              <div className="grid grid-cols-1 gap-6">
                <InfoDisplay 
                  label="Medications Content" 
                  value={formData.medicationsContent} 
                />
              </div>
            </InfoSection>
          </CardContent>
        </Card>
      )}

      {/* Session Content Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            Session Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          {formData.symptomDescription && (
            <InfoSection title="Subjective (Symptom Description)">
              <div className="grid grid-cols-1 gap-6">
                <InfoDisplay 
                  label="Symptom Description" 
                  value={formData.symptomDescription} 
                />
              </div>
            </InfoSection>
          )}

          {formData.objectiveContent && (
            <InfoSection title="Objective Content">
              <div className="grid grid-cols-1 gap-6">
                <InfoDisplay 
                  label="Objective Content" 
                  value={formData.objectiveContent} 
                />
              </div>
            </InfoSection>
          )}
        </CardContent>
      </Card>

      {/* Interventions Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Interventions Used
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InfoSection title="Therapeutic Interventions">
            <div className="grid grid-cols-1 gap-6">
              {formData.selectedInterventions && formData.selectedInterventions.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Selected Interventions</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formData.selectedInterventions.map((intervention, index) => (
                      <Badge key={index} variant="outline">{intervention}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {formData.otherInterventions && (
                <InfoDisplay 
                  label="Other Interventions" 
                  value={formData.otherInterventions} 
                />
              )}
            </div>
          </InfoSection>
        </CardContent>
      </Card>

      {/* Treatment Plan Progress Section */}
      {formData.objectives && formData.objectives.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              Treatment Plan Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InfoSection title="Objective Progress">
              <div className="space-y-4">
                {formData.objectives.map((objective, index) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InfoDisplay 
                        label={`Objective ${index + 1}`} 
                        value={objective.objectiveText} 
                      />
                      <InfoDisplay 
                        label="Progress" 
                        value={objective.progress} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </InfoSection>
          </CardContent>
        </Card>
      )}

      {/* Planning Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            Planning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InfoSection title="Treatment Planning">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.planContent && (
                <div className="md:col-span-2">
                  <InfoDisplay 
                    label="Plan Content" 
                    value={formData.planContent} 
                  />
                </div>
              )}
              {formData.recommendation && (
                <InfoDisplay 
                  label="Recommendation" 
                  value={getRecommendationLabel(formData.recommendation)} 
                />
              )}
              {formData.prescribedFrequency && (
                <InfoDisplay 
                  label="Prescribed Frequency" 
                  value={getPrescribedFrequencyLabel(formData.prescribedFrequency)} 
                />
              )}
            </div>
          </InfoSection>
        </CardContent>
      </Card>
    </>
  );
};

export default ProgressNoteView;
