
import React from 'react';
import NoteCard from './NoteCard';
import EmptyNotesState from './EmptyNotesState';
import EmptySearchResults from './EmptySearchResults';
import PaginationInfo from './PaginationInfo';
import EnhancedErrorBoundary from '@/components/EnhancedErrorBoundary';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { Note } from '@/types/note';

interface NotesDisplaySectionProps {
  notes: Note[];
  isLoading: boolean;
  totalNotes: number;
  currentPage: number;
  notesPerPage: number;
  onPageChange: (page: number) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  searchQuery?: string;
}

const NotesDisplaySection: React.FC<NotesDisplaySectionProps> = ({
  notes,
  isLoading,
  totalNotes,
  currentPage,
  notesPerPage,
  onPageChange,
  onEdit,
  onDelete,
  onView,
  searchQuery,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (notes.length === 0) {
    if (searchQuery) {
      return <EmptySearchResults searchQuery={searchQuery} />;
    }
    return <EmptyNotesState />;
  }

  const totalPages = Math.ceil(totalNotes / notesPerPage);

  return (
    <EnhancedErrorBoundary>
      <div className="space-y-6">
        {/* Notes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <PaginationInfo
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalNotes}
              itemsPerPage={notesPerPage}
            />
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    </EnhancedErrorBoundary>
  );
};

export default NotesDisplaySection;
