
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus } from 'lucide-react';
import NotesFilters from '../components/notes/NotesFilters';
import EmptyNotesState from '../components/notes/EmptyNotesState';
import LoadingSpinner from '../../../components/LoadingSpinner';
import NotesDisplaySection from '../components/notes/NotesDisplaySection';
import EnhancedErrorBoundary from '@/components/EnhancedErrorBoundary';
import LoadingWithError from '@/components/LoadingWithError';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import { Button } from '@/components/basic/button';
import { noteService } from '@/services/noteService';
import { Note } from '@/types/noteType';
import { filterNotes, sortNotes } from '../components/notes/utils/noteFilters';

type NoteStatus = 'all' | 'draft' | 'signed' | 'submitted_for_review' | 'approved' | 'rejected' | 'locked';
type NoteType = 'all' | 'intake' | 'progress_note' | 'treatment_plan' | 'cancellation_note' | 'contact_note' | 'consultation_note' | 'miscellaneous_note';

const NotesList = () => {
  const navigate = useNavigate();
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

  // Helper function to get the correct route based on note type
  const getNoteRoute = (note: Note, isEdit: boolean = false) => {
    const baseRoute = isEdit ? 'edit' : '';
    const separator = isEdit ? '/edit' : '';
    
    switch (note.noteType) {
      case 'progress_note':
        return `/notes/progress-note/${note.id}${separator}`;
      case 'intake':
        return `/notes/intake/${note.id}${separator}`;
      case 'treatment_plan':
        return `/notes/treatment-plan/${note.id}${separator}`;
      case 'cancellation_note':
        return `/notes/cancellation-note/${note.id}${separator}`;
      case 'contact_note':
        return `/notes/contact-note/${note.id}${separator}`;
      case 'consultation_note':
        return `/notes/consultation-note/${note.id}${separator}`;
      case 'miscellaneous_note':
        return `/notes/miscellaneous-note/${note.id}${separator}`;
      default:
        // Fallback to generic route
        return `/notes/note/${note.id}${separator}`;
    }
  };

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
    // Find the note by ID to get the note type
    const note = filteredNotes.find(n => n.id === id);
    if (note) {
      const editRoute = getNoteRoute(note, true);
      navigate(editRoute);
    } else {
      // Fallback to generic route if note not found
      navigate(`/notes/note/${id}/edit`);
    }
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
    // Find the note by ID to get the note type
    const note = filteredNotes.find(n => n.id === id);
    if (note) {
      const viewRoute = getNoteRoute(note, false);
      navigate(viewRoute);
    } else {
      // Fallback to generic route if note not found
      navigate(`/notes/note/${id}`);
    }
  };

  const handleCreateNote = () => {
    navigate('/notes/create-note');
  };

  return (
    <PageLayout variant="gradient">
      <PageHeader
        icon={FileText}
        title="All Notes"
        description="View and manage all your clinical notes, assessments, and documentation"
        action={
          <Button
            onClick={handleCreateNote}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Note
          </Button>
        }
      />
      
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
    </PageLayout>
  );
};

export default NotesList;
