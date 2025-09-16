import React, { useState, useEffect } from 'react';
import { Label } from '@/components/basic/label';
import { SelectField } from '@/components/basic/select';
import { FileText, Search } from 'lucide-react';
import { noteService } from '@/services/noteService';
import { Note } from '@/types/noteType';

interface NoteSelectionSectionProps {
  clientId: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const NoteSelectionSection: React.FC<NoteSelectionSectionProps> = ({
  clientId,
  value,
  onChange,
  error
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (clientId) {
      loadNotes();
    } else {
      setNotes([]);
    }
  }, [clientId]);

  const loadNotes = async () => {
    if (!clientId) return;
    
    setIsLoading(true);
    try {
      const response = await noteService.getNotes({
        clientId,
        limit: 100, // Get more notes for selection
        status: 'signed' // Only show signed notes
      });
      setNotes(response.notes);
    } catch (error) {
      console.error('Error loading notes:', error);
      setNotes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const selectOptions = notes.map(note => ({
    value: note.id,
    label: `${note.title} (${note.noteType})`
  }));

  return (
    <div className="space-y-2">
      <Label className="flex items-center space-x-2 text-gray-700 font-medium">
        <FileText className="h-4 w-4 text-blue-500" />
        <span>Associated Note</span>
      </Label>
      <SelectField
        label=""
        required={false}
        value={value}
        onValueChange={onChange}
        placeholder={isLoading ? "Loading notes..." : "Select a note (optional)"}
        options={selectOptions}
        containerClassName="w-full"
        disabled={isLoading || !clientId}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {!clientId && (
        <p className="mt-1 text-sm text-gray-500">
          Please select a client first to see available notes.
        </p>
      )}
      {clientId && !isLoading && notes.length === 0 && (
        <p className="mt-1 text-sm text-gray-500">
          No signed notes available for this client.
        </p>
      )}
    </div>
  );
};

export default NoteSelectionSection;
