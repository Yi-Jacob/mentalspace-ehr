
import React from 'react';
import { Label } from '@/components/basic/label';
import { Textarea } from '@/components/basic/textarea';

interface NotesSectionProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

const NotesSection: React.FC<NotesSectionProps> = ({
  notes,
  onNotesChange
}) => {
  return (
    <div className="md:col-span-2">
      <Label htmlFor="notes" className="text-gray-700 font-medium mb-2 block">Notes</Label>
      <Textarea
        id="notes"
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        className="bg-white/70 border-gray-200 focus:border-blue-400 transition-all duration-200"
        placeholder="Additional notes..."
        rows={3}
      />
    </div>
  );
};

export default NotesSection;
