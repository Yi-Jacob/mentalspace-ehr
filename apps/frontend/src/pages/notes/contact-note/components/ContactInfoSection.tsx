
import React from 'react';
import { InputField } from '@/components/basic/input';
import { SelectField } from '@/components/basic/select';
import { DateInput } from '@/components/basic/date-input';
import { ContactNoteFormData } from '@/types/noteType';
import { CONTACT_TYPES, CONTACT_INITIATORS } from '@/types/enums/notesEnum';

interface ContactInfoSectionProps {
  formData: ContactNoteFormData;
  updateFormData: (updates: Partial<ContactNoteFormData>) => void;
}

const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DateInput
          id="contactDate"
          label="Contact Date"
          value={formData.contactDate}
          onChange={(value) => updateFormData({ contactDate: value })}
          required
        />
        <InputField
          id="contactTime"
          label="Contact Time"
          type="time"
          value={formData.contactTime}
          onChange={(e) => updateFormData({ contactTime: e.target.value })}
        />
        <InputField
          id="contactDuration"
          label="Duration (minutes)"
          type="number"
          min="1"
          value={formData.contactDuration.toString()}
          onChange={(e) => updateFormData({ contactDuration: parseInt(e.target.value) || 0 })}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          label="Contact Type"
          value={formData.contactType}
          onValueChange={(value) => updateFormData({ contactType: value as 'phone' | 'email' | 'text' | 'video_call' | 'in_person' | 'collateral' })}
          options={CONTACT_TYPES}
          required
        />
        <SelectField
          label="Contact Initiated By"
          value={formData.contactInitiator}
          onValueChange={(value) => updateFormData({ contactInitiator: value as 'client' | 'provider' | 'family' | 'other_provider' | 'emergency' })}
          options={CONTACT_INITIATORS}
          required
        />
      </div>
    </div>
  );
};

export default ContactInfoSection;
