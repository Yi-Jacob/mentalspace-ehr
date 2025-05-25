
import React, { useState } from 'react';
import NotesFilters from './notes/NotesFilters';
import NoteCard from './notes/NoteCard';
import EmptyNotesState from './notes/EmptyNotesState';
import LoadingSpinner from './notes/LoadingSpinner';
import { useNotesQuery } from './notes/hooks/useNotesQuery';
import { filterNotesBySearch } from './notes/utils/noteFilters';

type NoteStatus = 'all' | 'draft' | 'signed' | 'submitted_for_review' | 'approved' | 'rejected' | 'locked';
type NoteType = 'all' | 'intake' | 'progress_note' | 'treatment_plan' | 'cancellation_note' | 'contact_note' | 'consultation_note' | 'miscellaneous_note';

const NotesList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<NoteStatus>('all');
  const [typeFilter, setTypeFilter] = useState<NoteType>('all');

  const { data: notes, isLoading } = useNotesQuery(statusFilter, typeFilter);
  const filteredNotes = filterNotesBySearch(notes, searchTerm);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <NotesFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />

      <div className="space-y-4">
        {filteredNotes?.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
        
        {filteredNotes?.length === 0 && <EmptyNotesState />}
      </div>
    </div>
  );
};

export default NotesList;
