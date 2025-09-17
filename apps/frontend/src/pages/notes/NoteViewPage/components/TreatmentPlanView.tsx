import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { InfoDisplay, InfoSection } from '@/components/basic/InfoDisplay';
import { Badge } from '@/components/basic/badge';
import { 
  FileText, 
  User, 
  Calendar, 
  Stethoscope,
  AlertTriangle,
  Target,
  Clock,
  CheckCircle,
  FileText as FileTextIcon,
  Heart,
  Brain,
  Users
} from 'lucide-react';
import { format } from 'date-fns';
import { 
  PRIORITY_OPTIONS,
  SESSION_FREQUENCY_OPTIONS,
  SESSION_DURATION_OPTIONS,
  MODALITY_OPTIONS
} from '@/types/enums/notesEnum';

interface TreatmentPlanViewProps {
  noteData: any;
}

const TreatmentPlanView: React.FC<TreatmentPlanViewProps> = ({ noteData }) => {
  const formData = noteData.content;

  const getPriorityLabel = (value: string) => {
    const priority = PRIORITY_OPTIONS.find(p => p.value === value);
    return priority ? priority.label : value;
  };

  const getSessionFrequencyLabel = (value: string) => {
    const frequency = SESSION_FREQUENCY_OPTIONS.find(f => f.value === value);
    return frequency ? frequency.label : value;
  };

  const getSessionDurationLabel = (value: string) => {
    const duration = SESSION_DURATION_OPTIONS.find(d => d.value === value);
    return duration ? duration.label : value;
  };

  const getModalityLabel = (value: string) => {
    const modality = MODALITY_OPTIONS.find(m => m.value === value);
    return modality ? modality.label : value;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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
              {formData.treatmentPlanDate && (
                <InfoDisplay 
                  label="Treatment Plan Date" 
                  value={format(new Date(formData.treatmentPlanDate), 'PPP')} 
                />
              )}
              {formData.primaryPhone && (
                <InfoDisplay 
                  label="Primary Phone" 
                  value={formData.primaryPhone} 
                />
              )}
              {formData.primaryEmail && (
                <InfoDisplay 
                  label="Primary Email" 
                  value={formData.primaryEmail} 
                />
              )}
              {formData.primaryInsurance && (
                <InfoDisplay 
                  label="Primary Insurance" 
                  value={formData.primaryInsurance} 
                />
              )}
              {formData.cptCode && (
                <InfoDisplay 
                  label="CPT Code" 
                  value={formData.cptCode} 
                />
              )}
            </div>
          </InfoSection>
        </CardContent>
      </Card>

      {/* Diagnosis Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-green-600" />
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

      {/* Presenting Problem Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Presenting Problem
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InfoSection title="Problem Assessment">
            <div className="grid grid-cols-1 gap-6">
              {formData.presentingProblem && (
                <InfoDisplay 
                  label="Presenting Problem" 
                  value={formData.presentingProblem} 
                />
              )}
              {formData.functionalImpairments && formData.functionalImpairments.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Functional Impairments</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formData.functionalImpairments.map((impairment, index) => (
                      <Badge key={index} variant="outline">{impairment}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {formData.strengths && formData.strengths.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Client Strengths</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formData.strengths.map((strength, index) => (
                      <Badge key={index} variant="secondary">{strength}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </InfoSection>
        </CardContent>
      </Card>

      {/* Treatment Goals Section */}
      {formData.treatmentGoals && formData.treatmentGoals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              Treatment Goals & Objectives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InfoSection title="Treatment Goals">
              <div className="space-y-6">
                {formData.treatmentGoals.map((goal, goalIndex) => (
                  <div key={goalIndex} className="border rounded-lg p-4 bg-gradient-to-r from-purple-50 to-blue-50">
                    <div className="space-y-4">
                      {/* Goal Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="h-4 w-4 text-purple-600" />
                            <h4 className="font-medium text-purple-900">Goal {goalIndex + 1}</h4>
                            <Badge 
                              variant="outline" 
                              className={getPriorityColor(goal.priority)}
                            >
                              {getPriorityLabel(goal.priority)}
                            </Badge>
                          </div>
                          <p className="text-gray-900">{goal.goalText}</p>
                          {goal.targetDate && (
                            <p className="text-sm text-gray-600 mt-1">
                              Target Date: {format(new Date(goal.targetDate), 'PPP')}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Objectives */}
                      {goal.objectives && goal.objectives.length > 0 && (
                        <div className="ml-6 space-y-3">
                          <h5 className="font-medium text-gray-700">Objectives:</h5>
                          {goal.objectives.map((objective, objIndex) => (
                            <div key={objIndex} className="border-l-4 border-blue-200 pl-4 bg-white rounded-r-lg p-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoDisplay 
                                  label="Objective" 
                                  value={objective.objectiveText} 
                                />
                                {objective.targetDate && (
                                  <InfoDisplay 
                                    label="Target Date" 
                                    value={format(new Date(objective.targetDate), 'PPP')} 
                                  />
                                )}
                                {objective.estimatedCompletion && (
                                  <InfoDisplay 
                                    label="Estimated Completion" 
                                    value={objective.estimatedCompletion} 
                                  />
                                )}
                                {objective.completionDate && (
                                  <InfoDisplay 
                                    label="Completion Date" 
                                    value={format(new Date(objective.completionDate), 'PPP')} 
                                  />
                                )}
                                {objective.method && (
                                  <InfoDisplay 
                                    label="Method" 
                                    value={objective.method} 
                                  />
                                )}
                                {objective.frequency && (
                                  <InfoDisplay 
                                    label="Frequency" 
                                    value={objective.frequency} 
                                  />
                                )}
                              </div>
                              
                              {/* Strategies */}
                              {objective.strategies && objective.strategies.length > 0 && (
                                <div className="mt-3">
                                  <label className="text-sm font-medium text-gray-500">Strategies:</label>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {objective.strategies.map((strategy, strategyIndex) => (
                                      <Badge key={strategyIndex} variant="outline" className="text-xs">
                                        {strategy}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </InfoSection>
          </CardContent>
        </Card>
      )}

      {/* Discharge Planning Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            Discharge Planning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InfoSection title="Discharge Criteria & Planning">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.dischargeCriteria && (
                <div className="md:col-span-2">
                  <InfoDisplay 
                    label="Discharge Criteria" 
                    value={formData.dischargeCriteria} 
                  />
                </div>
              )}
              {formData.estimatedDuration && (
                <InfoDisplay 
                  label="Estimated Duration" 
                  value={formData.estimatedDuration} 
                />
              )}
              {formData.aftercareRecommendations && (
                <div className="md:col-span-2">
                  <InfoDisplay 
                    label="Aftercare Recommendations" 
                    value={formData.aftercareRecommendations} 
                  />
                </div>
              )}
            </div>
          </InfoSection>
        </CardContent>
      </Card>

      {/* Additional Information Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileTextIcon className="h-5 w-5 text-indigo-600" />
            Additional Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InfoSection title="Additional Clinical Information">
            <div className="grid grid-cols-1 gap-6">
              {formData.additionalInformation && (
                <InfoDisplay 
                  label="Additional Information" 
                  value={formData.additionalInformation} 
                />
              )}
              {formData.medicalConsiderations && (
                <InfoDisplay 
                  label="Medical Considerations" 
                  value={formData.medicalConsiderations} 
                />
              )}
              {formData.psychosocialFactors && (
                <InfoDisplay 
                  label="Psychosocial Factors" 
                  value={formData.psychosocialFactors} 
                />
              )}
              {formData.culturalConsiderations && (
                <InfoDisplay 
                  label="Cultural Considerations" 
                  value={formData.culturalConsiderations} 
                />
              )}
            </div>
          </InfoSection>
        </CardContent>
      </Card>

      {/* Frequency Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-600" />
            Frequency of Treatment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InfoSection title="Treatment Frequency & Modality">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.sessionFrequency && (
                <InfoDisplay 
                  label="Session Frequency" 
                  value={getSessionFrequencyLabel(formData.sessionFrequency)} 
                />
              )}
              {formData.sessionDuration && (
                <InfoDisplay 
                  label="Session Duration" 
                  value={getSessionDurationLabel(formData.sessionDuration)} 
                />
              )}
              {formData.modality && (
                <InfoDisplay 
                  label="Treatment Modality" 
                  value={getModalityLabel(formData.modality)} 
                />
              )}
              {formData.prescribedFrequency && (
                <InfoDisplay 
                  label="Prescribed Frequency" 
                  value={getSessionFrequencyLabel(formData.prescribedFrequency)} 
                />
              )}
              <div className="md:col-span-2">
                <InfoDisplay 
                  label="Medical Necessity Declaration" 
                  value={formData.medicalNecessityDeclaration ? 'Yes - Services declared medically necessary' : 'No'} 
                />
              </div>
            </div>
          </InfoSection>
        </CardContent>
      </Card>
    </>
  );
};

export default TreatmentPlanView;
