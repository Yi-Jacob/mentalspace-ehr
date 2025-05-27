
import React, { useState } from 'react';
import NotesFilters from './notes/NotesFilters';
import NoteCard from './notes/NoteCard';
import EmptyNotesState from './notes/EmptyNotesState';
import LoadingSpinner from './notes/LoadingSpinner';
import EnhancedErrorBoundary from '@/components/EnhancedErrorBoundary';
import LoadingWithError from '@/components/LoadingWithError';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { useNotesQuery } from './notes/hooks/useNotesQuery';
import { filterNotesBySearch } from './notes/utils/noteFilters';
import { usePagination } from '@/hooks/usePagination';
import { useEnhancedErrorHandler } from '@/hooks/useEnhancedErrorHandler';

type NoteStatus = 'all' | 'draft' | 'signed' | 'submitted_for_review' | 'approved' | 'rejected' | 'locked';
type NoteType = 'all' | 'intake' | 'progress_note' | 'treatment_plan' | 'cancellation_note' | 'contact_note' | 'consultation_note' | 'miscellaneous_note';

const NotesList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<NoteStatus>('all');
  const [typeFilter, setTypeFilter] = useState<NoteType>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

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

  const { 
    data: notesData, 
    isLoading, 
    error, 
    refetch 
  } = useNotesQuery(statusFilter, typeFilter, {
    page: currentPage,
    pageSize,
    selectFields: ['id', 'title', 'note_type', 'status', 'created_at', 'updated_at', 'client_id']
  });

  // Apply search filter to current page data
  const filteredNotes = filterNotesBySearch(notesData?.data || [], searchTerm);

  const handleRetry = async () => {
    try {
      await executeWithRetry(
        () => refetch(),
        'Load Clinical Notes'
      );
    } catch (retryError) {
      // Create proper Error object if retryError is not already an Error
      const errorObj = retryError instanceof Error 
        ? retryError 
        : new Error(retryError?.message || 'Failed to load clinical notes');
      
      handleAPIError(errorObj, '/clinical-notes', 'GET');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Convert error to proper Error object if needed
  const processedError = error ? (error instanceof Error ? error : new Error(error.message || 'Failed to load notes')) : null;

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
          onRetry={canRetry ? handleRetry : undefined}
          retryCount={retryCount}
          maxRetries={3}
          errorTitle="Failed to load clinical notes"
          errorDescription="Unable to fetch your clinical notes. Please check your connection and try again."
          loadingComponent={<LoadingSpinner />}
        >
          <div className="space-y-4">
            {/* Show pagination info */}
            {notesData && notesData.totalCount > 0 && (
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>
                  Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, notesData.totalCount)} of {notesData.totalCount} notes
                </span>
                <span>Page {currentPage} of {notesData.totalPages}</span>
              </div>
            )}

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

            {/* Pagination */}
            {notesData && notesData.totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={notesData.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </LoadingWithError>
      </div>
    </EnhancedErrorBoundary>
  );
};

export default NotesList;
