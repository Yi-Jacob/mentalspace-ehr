
import React from 'react';
import { InputField } from '@/components/basic/input';
import { SelectField } from '@/components/basic/select';
import { TextareaField } from '@/components/basic/textarea';
import { DateInput } from '@/components/basic/date-input';
import { ConsultationNoteFormData } from '@/types/noteType';
import { CONSULTATION_TYPES } from '@/types/enums/notesEnum';

interface ConsultationInfoSectionProps {
  formData: ConsultationNoteFormData;
  updateFormData: (updates: Partial<ConsultationNoteFormData>) => void;
}

const ConsultationInfoSection: React.FC<ConsultationInfoSectionProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Consultation Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DateInput
          id="consultationDate"
          label="Consultation Date"
          value={formData.consultationDate}
          onChange={(value) => updateFormData({ consultationDate: value })}
          required
        />
        <InputField
          id="consultationTime"
          label="Consultation Time"
          type="time"
          value={formData.consultationTime}
          onChange={(e) => updateFormData({ consultationTime: e.target.value })}
        />
        <InputField
          id="consultationDuration"
          label="Duration (minutes)"
          type="number"
          min="1"
          value={formData.consultationDuration.toString()}
          onChange={(e) => updateFormData({ consultationDuration: parseInt(e.target.value) || 0 })}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          label="Consultation Type"
          value={formData.consultationType}
          onValueChange={(value) => updateFormData({ consultationType: value as 'case_review' | 'treatment_planning' | 'supervision' | 'peer_consultation' | 'multidisciplinary_team' })}
          options={CONSULTATION_TYPES}
          required
        />
      </div>

      <TextareaField
        id="consultationPurpose"
        label="Consultation Purpose"
        value={formData.consultationPurpose}
        onChange={(e) => updateFormData({ consultationPurpose: e.target.value })}
        placeholder="Describe the purpose and goals of this consultation..."
        rows={3}
        required
      />
    </div>
  );
};

export default ConsultationInfoSection;
