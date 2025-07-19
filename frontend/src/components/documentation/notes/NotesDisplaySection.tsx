
import React from 'react';
import NoteCard from './NoteCard';
import EmptyNotesState from './EmptyNotesState';
import EmptySearchResults from './EmptySearchResults';
import PaginationInfo from './PaginationInfo';
import EnhancedErrorBoundary from '@/components/EnhancedErrorBoundary';
import { PaginationControls } from '@/components/shared/ui/pagination-controls';

interface ClinicalNote {
  id: string;
  title: string;
  note_type: string;
  status: string;
  created_at: string;
  updated_at: string;
  client_id: string;
  clients?: {
    first_name: string;
    last_name: string;
  };
  provider?: {
    first_name: string;
    last_name: string;
  };
}

interface NotesDisplaySectionProps {
  filteredNotes: ClinicalNote[];
  allNotes: ClinicalNote[];
  notesData: {
    totalCount: number;
    totalPages: number;
  } | undefined;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const NotesDisplaySection: React.FC<NotesDisplaySectionProps> = ({
  filteredNotes,
  allNotes,
  notesData,
  currentPage,
  pageSize,
  onPageChange,
}) => {
  const hasNotes = allNotes && allNotes.length > 0;
  const hasFilteredNotes = filteredNotes && filteredNotes.length > 0;
  const showEmptyState = !hasNotes;
  const showEmptySearch = hasNotes && !hasFilteredNotes;

  return (
    <div className="space-y-4">
      {/* Pagination info */}
      {notesData && (
        <PaginationInfo
          currentPage={currentPage}
          pageSize={pageSize}
          totalCount={notesData.totalCount}
          totalPages={notesData.totalPages}
        />
      )}

      {/* Notes list */}
      {hasFilteredNotes && filteredNotes.map((note) => (
        <EnhancedErrorBoundary 
          key={note.id}
          componentName="NoteCard"
          fallback={
            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
              <p className="text-sm text-red-600">Failed to load note: {note.title}</p>
            </div>
          }
        >
          <NoteCard note={note} />
        </EnhancedErrorBoundary>
      ))}
      
      {/* Empty states */}
      {showEmptyState && <EmptyNotesState />}
      {showEmptySearch && <EmptySearchResults />}

      {/* Pagination */}
      {notesData && notesData.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <PaginationControls
            currentPage={currentPage}
            totalPages={notesData.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default NotesDisplaySection;
