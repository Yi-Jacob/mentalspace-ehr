
import React from 'react';
import { Label } from '@/components/basic/label';
import { Textarea } from '@/components/basic/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { ProgressNoteFormData } from '../types/ProgressNoteFormData';
import SmartTemplates from '../components/SmartTemplates';

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
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent">
          <CardTitle className="text-blue-900">Symptom Description and Subjective Report</CardTitle>
          <p className="text-sm text-blue-700">Document the client's subjective experience and reported symptoms</p>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <Label htmlFor="symptomDescription" className="text-sm font-medium">
              Subjective information discussed in session, such as report of symptoms
            </Label>
            
            <SmartTemplates
              fieldType="subjective"
              currentFieldValue={formData.symptomDescription}
              onInsertTemplate={(content) => updateFormData({ symptomDescription: content })}
            />
            
            <Textarea
              id="symptomDescription"
              value={formData.symptomDescription || ''}
              onChange={(e) => updateFormData({ symptomDescription: e.target.value })}
              placeholder="Document client's subjective report of symptoms, mood, functioning, and any relevant information shared during the session..."
              rows={6}
              className="min-h-[120px]"
            />
            <div className="text-xs text-gray-500 mt-1">
              Tip: Include mood ratings, sleep patterns, appetite changes, and client's perspective on progress
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="bg-gradient-to-r from-green-50 to-transparent">
          <CardTitle className="text-green-900">Objective Content</CardTitle>
          <p className="text-sm text-green-700">Document observable behaviors and clinical findings</p>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <Label htmlFor="objectiveContent" className="text-sm font-medium">
              Objective information observed during the session
            </Label>
            
            <SmartTemplates
              fieldType="objective"
              currentFieldValue={formData.objectiveContent}
              onInsertTemplate={(content) => updateFormData({ objectiveContent: content })}
            />
            
            <Textarea
              id="objectiveContent"
              value={formData.objectiveContent || ''}
              onChange={(e) => updateFormData({ objectiveContent: e.target.value })}
              placeholder="Document objective observations, behaviors, and clinical findings during the session..."
              rows={6}
              className="min-h-[120px]"
            />
            <div className="text-xs text-gray-500 mt-1">
              Tip: Include appearance, speech patterns, behavior, affect, and any observable changes
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentSection;
