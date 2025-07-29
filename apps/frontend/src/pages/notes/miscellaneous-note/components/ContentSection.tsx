
import React from 'react';
import { Label } from '@/components/basic/label';
import { Textarea } from '@/components/basic/textarea';
import { FileText } from 'lucide-react';
import { MiscellaneousNoteFormData } from '../types/MiscellaneousNoteFormData';

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
      
      <div>
        <Label htmlFor="noteDescription">Brief Description *</Label>
        <Textarea
          id="noteDescription"
          value={formData.noteDescription}
          onChange={(e) => updateFormData({ noteDescription: e.target.value })}
          placeholder="Provide a brief description of the event or activity..."
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="detailedNotes">Detailed Notes</Label>
        <Textarea
          id="detailedNotes"
          value={formData.detailedNotes}
          onChange={(e) => updateFormData({ detailedNotes: e.target.value })}
          placeholder="Provide detailed information, observations, or notes..."
          rows={5}
        />
      </div>
    </div>
  );
};

export default ContentSection;
