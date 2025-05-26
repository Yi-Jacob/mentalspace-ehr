
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ConsultationNoteFormData } from '../types/ConsultationNoteFormData';

interface ClinicalDiscussionSectionProps {
  formData: Pick<ConsultationNoteFormData, 'presentingConcerns' | 'backgroundInformation' | 'currentTreatment'>;
  updateFormData: (updates: Partial<ConsultationNoteFormData>) => void;
}

const ClinicalDiscussionSection: React.FC<ClinicalDiscussionSectionProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Clinical Discussion</h3>
      
      <div>
        <Label htmlFor="presentingConcerns">Presenting Concerns *</Label>
        <Textarea
          id="presentingConcerns"
          value={formData.presentingConcerns}
          onChange={(e) => updateFormData({ presentingConcerns: e.target.value })}
          placeholder="Describe the presenting concerns discussed in consultation..."
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="backgroundInformation">Background Information</Label>
        <Textarea
          id="backgroundInformation"
          value={formData.backgroundInformation}
          onChange={(e) => updateFormData({ backgroundInformation: e.target.value })}
          placeholder="Relevant background information shared..."
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="currentTreatment">Current Treatment</Label>
        <Textarea
          id="currentTreatment"
          value={formData.currentTreatment}
          onChange={(e) => updateFormData({ currentTreatment: e.target.value })}
          placeholder="Current treatment interventions and approaches..."
          rows={3}
        />
      </div>
    </div>
  );
};

export default ClinicalDiscussionSection;
