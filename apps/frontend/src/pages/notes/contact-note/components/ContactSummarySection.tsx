
import React from 'react';
import { Label } from '@/components/basic/label';
import { Input } from '@/components/basic/input';
import { Textarea } from '@/components/basic/textarea';
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
      
      <div>
        <Label htmlFor="contactSummary">Contact Summary *</Label>
        <Textarea
          id="contactSummary"
          value={formData.contactSummary}
          onChange={(e) => updateFormData({ contactSummary: e.target.value })}
          placeholder="Summarize the purpose and content of this contact..."
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="clientMoodStatus">Client Mood/Status</Label>
        <Input
          id="clientMoodStatus"
          value={formData.clientMoodStatus}
          onChange={(e) => updateFormData({ clientMoodStatus: e.target.value })}
          placeholder="Describe client's mood, affect, or status during contact"
        />
      </div>
    </div>
  );
};

export default ContactSummarySection;
