
import React from 'react';
import { InputField } from '@/components/basic/input';
import { SelectField } from '@/components/basic/select';
import { DateInput } from '@/components/basic/date-input';
import { MiscellaneousNoteFormData } from '@/types/noteType';
import { NOTE_CATEGORIES, URGENCY_LEVELS } from '@/types/enums/notesEnum';

interface BasicInfoSectionProps {
  formData: Pick<MiscellaneousNoteFormData, 'eventDate' | 'noteDate' | 'noteCategory' | 'noteSubtype' | 'urgencyLevel' | 'noteTitle'>;
  updateFormData: (updates: Partial<MiscellaneousNoteFormData>) => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Note Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DateInput
          id="eventDate"
          label="Event/Activity Date"
          value={formData.eventDate}
          onChange={(value) => updateFormData({ eventDate: value })}
          required
        />
        <DateInput
          id="noteDate"
          label="Note Date"
          value={formData.noteDate}
          onChange={(value) => updateFormData({ noteDate: value })}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SelectField
          label="Note Category"
          value={formData.noteCategory}
          onValueChange={(value) => updateFormData({ noteCategory: value as 'administrative' | 'legal' | 'insurance' | 'coordination_of_care' | 'incident_report' | 'other' })}
          options={NOTE_CATEGORIES}
          required
        />
        <InputField
          id="noteSubtype"
          label="Note Subtype"
          value={formData.noteSubtype}
          onChange={(e) => updateFormData({ noteSubtype: e.target.value })}
          placeholder="Specific type or subtype"
        />
        <SelectField
          label="Urgency Level"
          value={formData.urgencyLevel}
          onValueChange={(value) => updateFormData({ urgencyLevel: value as 'low' | 'medium' | 'high' | 'urgent' })}
          options={URGENCY_LEVELS}
        />
      </div>

      <InputField
        id="noteTitle"
        label="Note Title"
        value={formData.noteTitle}
        onChange={(e) => updateFormData({ noteTitle: e.target.value })}
        placeholder="Brief descriptive title for this note"
        required
      />
    </div>
  );
};

export default BasicInfoSection;
