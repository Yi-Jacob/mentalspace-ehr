
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressNoteFormData } from '../types/ProgressNoteFormData';

interface ContentSectionProps {
  formData: ProgressNoteFormData;
  updateFormData: (updates: Partial<ProgressNoteFormData>) => void;
}

const ContentSection: React.FC<ContentSectionProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Symptom Description and Subjective Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="symptomDescription">
              Subjective information discussed in session, such as report of symptoms
            </Label>
            <Textarea
              id="symptomDescription"
              value={formData.symptomDescription || ''}
              onChange={(e) => updateFormData({ symptomDescription: e.target.value })}
              placeholder="Document client's subjective report of symptoms, mood, functioning, and any relevant information shared during the session..."
              rows={6}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Objective Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="objectiveContent">
              Objective information discussed during the session
            </Label>
            <Textarea
              id="objectiveContent"
              value={formData.objectiveContent || ''}
              onChange={(e) => updateFormData({ objectiveContent: e.target.value })}
              placeholder="Document objective observations, behaviors, and clinical findings during the session..."
              rows={6}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentSection;
