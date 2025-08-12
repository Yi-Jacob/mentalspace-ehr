
import React from 'react';
import { Label } from '@/components/basic/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { ProgressNoteFormData } from '@/types/noteType';

interface MentalStatusSectionProps {
  formData: ProgressNoteFormData;
  updateFormData: (updates: Partial<ProgressNoteFormData>) => void;
}

const MentalStatusSection: React.FC<MentalStatusSectionProps> = ({
  formData,
  updateFormData,
}) => {
  const mentalStatusOptions = {
    orientation: [
      'X3: Oriented to Person, Place, and Time',
      'X2: Oriented to Person, Place; Impaired to Time',
      'X2: Oriented to Person, Time; Impaired to Place',
      'X2: Oriented to Time, Place; Impaired to Person',
      'X1: Oriented to Person; Impaired to Place, Time',
      'X1: Oriented to Place; Impaired to Person, Time',
      'X1: Oriented to Time; Impaired to Person, Place',
      'X0: Impaired to Person, Place, and Time',
      'Not Assessed'
    ],
    generalAppearance: [
      'Well-groomed',
      'Disheveled',
      'Unkempt',
      'Clean and neat',
      'Poor hygiene',
      'Age-appropriate',
      'Younger than stated age',
      'Older than stated age',
      'Not Assessed'
    ],
    dress: [
      'Appropriate',
      'Disheveled',
      'Emaciated',
      'Obese',
      'Poor Hygiene',
      'Inappropriate for weather',
      'Bizarre',
      'Seductive',
      'Not Assessed'
    ],
    motorActivity: [
      'Unremarkable',
      'Agitation',
      'Retardation',
      'Posturing',
      'Repetitive actions',
      'Tics',
      'Tremor',
      'Unusual Gait',
      'Hyperactive',
      'Hypoactive',
      'Restless',
      'Catatonic',
      'Not Assessed'
    ],
    interviewBehavior: [
      'Cooperative',
      'Uncooperative',
      'Guarded',
      'Hostile',
      'Evasive',
      'Suspicious',
      'Seductive',
      'Manipulative',
      'Demanding',
      'Pleasant',
      'Withdrawn',
      'Not Assessed'
    ],
    speech: [
      'Normal rate and rhythm',
      'Rapid',
      'Slow',
      'Loud',
      'Soft',
      'Pressured',
      'Monotone',
      'Slurred',
      'Stammering',
      'Circumstantial',
      'Tangential',
      'Flight of ideas',
      'Not Assessed'
    ],
    mood: [
      'Euthymic',
      'Depressed',
      'Elevated',
      'Irritable',
      'Anxious',
      'Angry',
      'Euphoric',
      'Dysphoric',
      'Labile',
      'Expansive',
      'Not Assessed'
    ],
    affect: [
      'Euthymic',
      'Depressed',
      'Elevated',
      'Irritable',
      'Anxious',
      'Angry',
      'Flat',
      'Blunted',
      'Labile',
      'Inappropriate',
      'Constricted',
      'Expansive',
      'Not Assessed'
    ],
    insight: [
      'Excellent',
      'Good',
      'Fair',
      'Poor',
      'Nil',
      'Not Assessed'
    ],
    judgmentImpulseControl: [
      'Excellent',
      'Good',
      'Fair',
      'Poor',
      'Nil',
      'Not Assessed'
    ],
    memory: [
      'Excellent',
      'Good',
      'Fair',
      'Poor',
      'Nil',
      'Not Assessed'
    ],
    attentionConcentration: [
      'Excellent',
      'Good',
      'Fair',
      'Poor',
      'Nil',
      'Not Assessed'
    ],
    thoughtProcess: [
      'Linear',
      'Goal-directed',
      'Circumstantial',
      'Tangential',
      'Flight of ideas',
      'Loose associations',
      'Word salad',
      'Thought blocking',
      'Perseveration',
      'Clang associations',
      'Not Assessed'
    ],
    thoughtContent: [
      'No abnormalities noted',
      'Obsessions',
      'Compulsions',
      'Phobias',
      'Suicidal ideation',
      'Homicidal ideation',
      'Delusions',
      'Ideas of reference',
      'Paranoid thoughts',
      'Not Assessed'
    ],
    perception: [
      'No abnormalities noted',
      'Auditory hallucinations',
      'Visual hallucinations',
      'Tactile hallucinations',
      'Olfactory hallucinations',
      'Gustatory hallucinations',
      'Illusions',
      'Depersonalization',
      'Derealization',
      'Not Assessed'
    ],
    functionalStatus: [
      'Independent in all activities',
      'Mild impairment',
      'Moderate impairment',
      'Severe impairment',
      'Requires assistance with ADLs',
      'Requires supervision',
      'Homebound',
      'Institutionalized',
      'Not Assessed'
    ]
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
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key}>{field.label}</Label>
              <Select
                value={formData[field.key as keyof ProgressNoteFormData] as string || ''}
                onValueChange={(value) => updateFormData({ [field.key]: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${field.label.toLowerCase()}...`} />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] bg-white">
                  {mentalStatusOptions[field.key as keyof typeof mentalStatusOptions].map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MentalStatusSection;
