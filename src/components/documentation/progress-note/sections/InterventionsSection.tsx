
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressNoteFormData } from '../types/ProgressNoteFormData';

interface InterventionsSectionProps {
  formData: ProgressNoteFormData;
  updateFormData: (updates: Partial<ProgressNoteFormData>) => void;
}

const InterventionsSection: React.FC<InterventionsSectionProps> = ({
  formData,
  updateFormData,
}) => {
  const interventions = [
    'Cognitive Challenging',
    'Cognitive Refocusing', 
    'Cognitive Reframing',
    'Communication Skills',
    'Compliance Issues',
    'DBT',
    'Exploration of Coping Patterns',
    'Exploration of Emotions',
    'Exploration of Relationship Patterns',
    'Guided Imagery',
    'Interactive Feedback',
    'Interpersonal Resolutions',
    'Mindfulness Training',
    'Preventative Services',
    'Psycho-Education',
    'Relaxation/Deep Breathing',
    'Review of Treatment Plan/Progress',
    'Role-Play/Behavioral Rehearsal',
    'Structured Problem Solving',
    'Supportive Reflection',
    'Symptom Management',
  ];

  const handleInterventionChange = (intervention: string, checked: boolean) => {
    const currentInterventions = formData.selectedInterventions || [];
    let updatedInterventions;

    if (checked) {
      updatedInterventions = [...currentInterventions, intervention];
    } else {
      updatedInterventions = currentInterventions.filter(i => i !== intervention);
    }

    updateFormData({ selectedInterventions: updatedInterventions });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interventions Used</CardTitle>
        <p className="text-sm text-gray-600">Select all interventions used during this session</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {interventions.map((intervention) => (
            <div key={intervention} className="flex items-center space-x-2">
              <Checkbox
                id={intervention}
                checked={formData.selectedInterventions?.includes(intervention) || false}
                onCheckedChange={(checked) => handleInterventionChange(intervention, checked as boolean)}
              />
              <Label htmlFor={intervention} className="text-sm">
                {intervention}
              </Label>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="otherInterventions">Other Interventions</Label>
          <Textarea
            id="otherInterventions"
            value={formData.otherInterventions || ''}
            onChange={(e) => updateFormData({ otherInterventions: e.target.value })}
            placeholder="Describe any other interventions used..."
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default InterventionsSection;
