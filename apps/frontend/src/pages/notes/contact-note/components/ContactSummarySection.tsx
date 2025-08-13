
import React from 'react';
import { InputField } from '@/components/basic/input';
import { TextareaField } from '@/components/basic/textarea';
import { ContactNoteFormData } from '@/types/noteType';

interface ContactSummarySectionProps {
  formData: ContactNoteFormData;
  updateFormData: (updates: Partial<ContactNoteFormData>) => void;
}

const ContactSummarySection: React.FC<ContactSummarySectionProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Contact Summary</h3>
      
      <TextareaField
        id="contactSummary"
        label="Contact Summary"
        value={formData.contactSummary}
        onChange={(e) => updateFormData({ contactSummary: e.target.value })}
        placeholder="Summarize the purpose and content of this contact..."
        rows={4}
        required
      />

      <InputField
        id="clientMoodStatus"
        label="Client Mood/Status"
        value={formData.clientMoodStatus}
        onChange={(e) => updateFormData({ clientMoodStatus: e.target.value })}
        placeholder="Describe client's mood, affect, or status during contact"
      />
    </div>
  );
};

export default ContactSummarySection;
