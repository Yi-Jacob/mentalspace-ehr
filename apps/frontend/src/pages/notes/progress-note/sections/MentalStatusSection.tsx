
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { SelectField } from '@/components/basic/select';
import { ProgressNoteFormData } from '@/types/noteType';
import {
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
  FUNCTIONAL_STATUS_OPTIONS
} from '@/types/enums/notesEnum';

interface MentalStatusSectionProps {
  formData: ProgressNoteFormData;
  updateFormData: (updates: Partial<ProgressNoteFormData>) => void;
}

const MentalStatusSection: React.FC<MentalStatusSectionProps> = ({
  formData,
  updateFormData,
}) => {
  const mentalStatusOptions = {
    orientation: ORIENTATION_OPTIONS,
    generalAppearance: GENERAL_APPEARANCE_OPTIONS,
    dress: DRESS_OPTIONS,
    motorActivity: MOTOR_ACTIVITY_OPTIONS,
    interviewBehavior: INTERVIEW_BEHAVIOR_OPTIONS,
    speech: SPEECH_OPTIONS,
    mood: MOOD_OPTIONS,
    affect: AFFECT_OPTIONS,
    insight: INSIGHT_OPTIONS,
    judgmentImpulseControl: JUDGMENT_OPTIONS,
    memory: MEMORY_OPTIONS,
    attentionConcentration: ATTENTION_OPTIONS,
    thoughtProcess: THOUGHT_PROCESS_OPTIONS,
    thoughtContent: THOUGHT_CONTENT_OPTIONS,
    perception: PERCEPTION_OPTIONS,
    functionalStatus: FUNCTIONAL_STATUS_OPTIONS
  };

  const fields = [
    { key: 'orientation', label: 'Orientation' },
    { key: 'generalAppearance', label: 'General Appearance' },
    { key: 'dress', label: 'Dress' },
    { key: 'motorActivity', label: 'Motor Activity' },
    { key: 'interviewBehavior', label: 'Interview Behavior' },
    { key: 'speech', label: 'Speech' },
    { key: 'mood', label: 'Mood' },
    { key: 'affect', label: 'Affect' },
    { key: 'insight', label: 'Insight' },
    { key: 'judgmentImpulseControl', label: 'Judgment/Impulse Control' },
    { key: 'memory', label: 'Memory' },
    { key: 'attentionConcentration', label: 'Attention/Concentration' },
    { key: 'thoughtProcess', label: 'Thought Process' },
    { key: 'thoughtContent', label: 'Thought Content' },
    { key: 'perception', label: 'Perception' },
    { key: 'functionalStatus', label: 'Functional Status' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Mental Status Examination</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <SelectField
              key={field.key}
              label={field.label}
              value={formData[field.key as keyof ProgressNoteFormData] as string || ''}
              onValueChange={(value) => updateFormData({ [field.key]: value })}
              options={mentalStatusOptions[field.key as keyof typeof mentalStatusOptions]}
              placeholder={`Select ${field.label.toLowerCase()}...`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MentalStatusSection;
