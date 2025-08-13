
import React from 'react';
import { TextareaField } from '@/components/basic/textarea';
import { FileText } from 'lucide-react';
import { MiscellaneousNoteFormData } from '@/types/noteType';

interface ContentSectionProps {
  formData: Pick<MiscellaneousNoteFormData, 'noteDescription' | 'detailedNotes'>;
  updateFormData: (updates: Partial<MiscellaneousNoteFormData>) => void;
}

const ContentSection: React.FC<ContentSectionProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
        <FileText className="h-5 w-5 text-blue-600" />
        <span>Note Content</span>
      </h3>
      
      <TextareaField
        id="noteDescription"
        label="Brief Description"
        value={formData.noteDescription}
        onChange={(e) => updateFormData({ noteDescription: e.target.value })}
        placeholder="Provide a brief description of the event or activity..."
        rows={3}
        required
      />

      <TextareaField
        id="detailedNotes"
        label="Detailed Notes"
        value={formData.detailedNotes}
        onChange={(e) => updateFormData({ detailedNotes: e.target.value })}
        placeholder="Provide detailed information, observations, or notes..."
        rows={5}
      />
    </div>
  );
};

export default ContentSection;
