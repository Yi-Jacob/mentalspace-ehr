
import React from 'react';
import { TextareaField } from '@/components/basic/textarea';
import { ConsultationNoteFormData } from '@/types/noteType';

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
      
      <TextareaField
        id="presentingConcerns"
        label="Presenting Concerns"
        value={formData.presentingConcerns}
        onChange={(e) => updateFormData({ presentingConcerns: e.target.value })}
        placeholder="Describe the presenting concerns discussed in consultation..."
        rows={3}
        required
      />

      <TextareaField
        id="backgroundInformation"
        label="Background Information"
        value={formData.backgroundInformation}
        onChange={(e) => updateFormData({ backgroundInformation: e.target.value })}
        placeholder="Relevant background information shared..."
        rows={3}
      />

      <TextareaField
        id="currentTreatment"
        label="Current Treatment"
        value={formData.currentTreatment}
        onChange={(e) => updateFormData({ currentTreatment: e.target.value })}
        placeholder="Current treatment interventions and approaches..."
        rows={3}
      />
    </div>
  );
};

export default ClinicalDiscussionSection;
