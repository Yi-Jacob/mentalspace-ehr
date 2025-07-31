
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import NotesFilters from './notes/NotesFilters';
import EmptyNotesState from './notes/EmptyNotesState';
import LoadingSpinner from '../../../components/LoadingSpinner';
import NotesDisplaySection from './notes/NotesDisplaySection';
import EnhancedErrorBoundary from '@/components/EnhancedErrorBoundary';
import LoadingWithError from '@/components/LoadingWithError';
import { noteService } from '@/services/noteService';
import { Note } from '@/types/noteType';
import { filterNotes, sortNotes } from './notes/utils/noteFilters';

type NoteStatus = 'all' | 'draft' | 'signed' | 'submitted_for_review' | 'approved' | 'rejected' | 'locked';
type NoteType = 'all' | 'intake' | 'progress_note' | 'treatment_plan' | 'cancellation_note' | 'contact_note' | 'consultation_note' | 'miscellaneous_note';

const NotesList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<NoteStatus>('all');
  const [typeFilter, setTypeFilter] = useState<NoteType>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const notesPerPage = 8;

  const { data: notesResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['notes', statusFilter, typeFilter, currentPage, notesPerPage],
    queryFn: async () => {
      const params: any = {
        page: currentPage,
        limit: notesPerPage,
      };
      
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      if (typeFilter !== 'all') {
        params.noteType = typeFilter;
      }
      
      return noteService.getNotes(params);
    },
  });

  // Apply search filter and sorting
  const filteredNotes = React.useMemo(() => {
    if (!notesResponse?.notes) return [];
    
    let filtered = notesResponse.notes;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${note.client?.firstName || ''} ${note.client?.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply additional filters
    const filterOptions = {
      status: statusFilter !== 'all' ? statusFilter : undefined,
      noteType: typeFilter !== 'all' ? typeFilter : undefined,
    };
    
    filtered = filterNotes(filtered, filterOptions);
    
    // Apply sorting
    filtered = sortNotes(filtered, sortBy, sortOrder);
    
    return filtered;
  }, [notesResponse?.notes, searchTerm, statusFilter, typeFilter, sortBy, sortOrder]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = (id: string) => {
    // Navigate to edit page
    window.location.href = `/notes/edit/${id}`;
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        await noteService.deleteNote(id);
        refetch();
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  const handleView = (id: string) => {
    // Navigate to view page
    window.location.href = `/notes/view/${id}`;
  };

  return (
    <EnhancedErrorBoundary 
      componentName="NotesList"
      showErrorDetails={process.env.NODE_ENV === 'development'}
      enableRetry={true}
    >
      <div className="space-y-6">
        <NotesFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
        />

        <LoadingWithError
          isLoading={isLoading}
          error={error}
          onRetry={() => refetch()}
          errorTitle="Failed to load clinical notes"
          errorDescription="There was an issue loading your clinical notes. Please try again."
          loadingComponent={<LoadingSpinner />}
        >
          <NotesDisplaySection
            notes={filteredNotes}
            isLoading={isLoading}
            totalNotes={notesResponse?.total || 0}
            currentPage={currentPage}
            notesPerPage={notesPerPage}
            onPageChange={handlePageChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            searchQuery={searchTerm}
          />
        </LoadingWithError>
      </div>
    </EnhancedErrorBoundary>
  );
};

export default NotesList;
