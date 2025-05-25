
import React, { useState } from 'react';
import NotesFilters from './notes/NotesFilters';
import NoteCard from './notes/NoteCard';
import EmptyNotesState from './notes/EmptyNotesState';
import LoadingSpinner from './notes/LoadingSpinner';
import EnhancedErrorBoundary from '@/components/EnhancedErrorBoundary';
import LoadingWithError from '@/components/LoadingWithError';
import { useNotesQuery } from './notes/hooks/useNotesQuery';
import { filterNotesBySearch } from './notes/utils/noteFilters';
import { useEnhancedErrorHandler } from '@/hooks/useEnhancedErrorHandler';

type NoteStatus = 'all' | 'draft' | 'signed' | 'submitted_for_review' | 'approved' | 'rejected' | 'locked';
type NoteType = 'all' | 'intake' | 'progress_note' | 'treatment_plan' | 'cancellation_note' | 'contact_note' | 'consultation_note' | 'miscellaneous_note';

const NotesList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<NoteStatus>('all');
  const [typeFilter, setTypeFilter] = useState<NoteType>('all');

  const { 
    handleError, 
    handleAPIError, 
    executeWithRetry, 
    retryCount, 
    canRetry,
    isRetrying 
  } = useEnhancedErrorHandler({
    component: 'NotesList',
    retryConfig: { 
      maxRetries: 3,
      baseDelay: 1000,
      timeoutMs: 15000 
    }
  });

  const { data: notes, isLoading, error, refetch } = useNotesQuery(statusFilter, typeFilter);
  
  const filteredNotes = filterNotesBySearch(notes, searchTerm);

  const handleRetry = async () => {
    try {
      await executeWithRetry(
        () => refetch(),
        'Load Clinical Notes'
      );
    } catch (retryError) {
      handleAPIError(retryError, '/clinical-notes', 'GET');
    }
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
          isLoading={isLoading || isRetrying}
          error={error}
          onRetry={canRetry ? handleRetry : undefined}
          retryCount={retryCount}
          maxRetries={3}
          errorTitle="Failed to load clinical notes"
          errorDescription="Unable to fetch your clinical notes. Please check your connection and try again."
          loadingComponent={<LoadingSpinner />}
        >
          <div className="space-y-4">
            {filteredNotes?.map((note) => (
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
            
            {filteredNotes?.length === 0 && <EmptyNotesState />}
          </div>
        </LoadingWithError>
      </div>
    </EnhancedErrorBoundary>
  );
};

export default NotesList;
