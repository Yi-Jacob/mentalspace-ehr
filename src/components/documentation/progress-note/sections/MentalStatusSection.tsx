
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressNoteFormData } from '../types/ProgressNoteFormData';

interface MentalStatusSectionProps {
  formData: ProgressNoteFormData;
  updateFormData: (updates: Partial<ProgressNoteFormData>) => void;
}

const MentalStatusSection: React.FC<MentalStatusSectionProps> = ({
  formData,
  updateFormData,
}) => {
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
              <Textarea
                id={field.key}
                value={formData[field.key as keyof ProgressNoteFormData] as string || ''}
                onChange={(e) => updateFormData({ [field.key]: e.target.value })}
                placeholder={`Describe ${field.label.toLowerCase()}...`}
                rows={2}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MentalStatusSection;
