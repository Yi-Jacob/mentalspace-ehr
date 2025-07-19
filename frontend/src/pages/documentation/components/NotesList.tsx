
import React, { useState } from 'react';
import NotesFilters from './notes/NotesFilters';
import EmptyNotesState from './notes/EmptyNotesState';
import LoadingSpinner from './notes/LoadingSpinner';
import NotesDisplaySection from './notes/NotesDisplaySection';
import EnhancedErrorBoundary from '@/components/EnhancedErrorBoundary';
import LoadingWithError from '@/components/LoadingWithError';
import { useNotesQuery } from './notes/hooks/useNotesQuery';
import { filterNotesBySearch } from './notes/utils/noteFilters';
import { useNotesErrorHandling } from './notes/hooks/useNotesErrorHandling';

type NoteStatus = 'all' | 'draft' | 'signed' | 'submitted_for_review' | 'approved' | 'rejected' | 'locked';
type NoteType = 'all' | 'intake' | 'progress_note' | 'treatment_plan' | 'cancellation_note' | 'contact_note' | 'consultation_note' | 'miscellaneous_note';

const NotesList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<NoteStatus>('all');
  const [typeFilter, setTypeFilter] = useState<NoteType>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const {
    retryCount,
    canRetry,
    isRetrying,
    getErrorMessage,
    handleRetry
  } = useNotesErrorHandling();

  const { 
    data: notesData, 
    isLoading, 
    error, 
    refetch 
  } = useNotesQuery(statusFilter, typeFilter, {
    page: currentPage,
    pageSize,
    selectFields: ['id', 'title', 'note_type', 'status', 'created_at', 'updated_at', 'client_id', 'provider_id']
  });

  const errorMessage = error ? getErrorMessage(error) : null;

  console.log('=== NOTESLIST RENDER ===', { 
    isLoading, 
    hasError: !!error,
    errorMessage, 
    notesCount: notesData?.data?.length,
    totalCount: notesData?.totalCount,
    currentPage,
    retryCount,
    isRetrying
  });

  // Apply search filter to current page data
  const filteredNotes = filterNotesBySearch(notesData?.data || [], searchTerm);

  const handlePageChange = (page: number) => {
    console.log('=== PAGE CHANGE ===');
    console.log('Changing from page', currentPage, 'to page', page);
    setCurrentPage(page);
  };

  // Convert error to proper Error object if needed
  const processedError = error ? (error instanceof Error ? error : new Error(getErrorMessage(error))) : null;

  // Show detailed error information in development
  if (error && process.env.NODE_ENV === 'development') {
    console.group('🔍 DETAILED ERROR ANALYSIS');
    console.log('Error type:', typeof error);
    console.log('Error instanceof Error:', error instanceof Error);
    console.log('Error object:', error);
    console.log('Processed error message:', errorMessage);
    console.groupEnd();
  }

  const handleRetryClick = () => handleRetry(refetch);

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
          error={processedError}
          onRetry={canRetry ? handleRetryClick : undefined}
          retryCount={retryCount}
          maxRetries={3}
          errorTitle="Failed to load clinical notes"
          errorDescription="There was an issue loading your clinical notes. Please try again."
          loadingComponent={<LoadingSpinner />}
        >
          <NotesDisplaySection
            filteredNotes={filteredNotes}
            allNotes={notesData?.data || []}
            notesData={notesData}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
        </LoadingWithError>
      </div>
    </EnhancedErrorBoundary>
  );
};

export default NotesList;
