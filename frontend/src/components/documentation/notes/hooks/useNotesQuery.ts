
import { useOptimizedQuery } from '@/hooks/useOptimizedQuery';
import { buildNotesQuery } from '../utils/queryBuilder';
import { enhanceNotesWithClientAndProviderData } from '../utils/dataEnhancement';
import { validateAndFilterNotes } from '../utils/dataValidation';

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

type NoteStatus = 'all' | 'draft' | 'signed' | 'submitted_for_review' | 'approved' | 'rejected' | 'locked';
type NoteType = 'all' | 'intake' | 'progress_note' | 'treatment_plan' | 'cancellation_note' | 'contact_note' | 'consultation_note' | 'miscellaneous_note';

interface UseNotesQueryOptions {
  page?: number;
  pageSize?: number;
  selectFields?: string[];
}

export const useNotesQuery = (
  statusFilter: NoteStatus, 
  typeFilter: NoteType, 
  options: UseNotesQueryOptions = {}
) => {
  const { page = 1, pageSize = 10, selectFields } = options;

  // Enhanced field selection with safer joins
  const defaultFields = [
    'id',
    'title', 
    'note_type',
    'status',
    'created_at',
    'updated_at',
    'client_id',
    'provider_id'
  ];

  const fields = selectFields || defaultFields;

  return useOptimizedQuery(
    ['clinical-notes', statusFilter, typeFilter, page.toString(), pageSize.toString()],
    async () => {
      console.log('=== STARTING CLINICAL NOTES QUERY ===');
      console.log('Query parameters:', { statusFilter, typeFilter, page, pageSize });
      
      try {
        // Step 1: Build and execute the query
        const query = buildNotesQuery(statusFilter, typeFilter, { page, pageSize, selectFields: fields });
        
        console.log('Executing clinical notes query...');
        const { data: notesData, error, count } = await query;
        
        if (error) {
          console.error('❌ Error fetching clinical notes:', error);
          throw new Error(`Failed to fetch clinical notes: ${error.message}`);
        }
        
        console.log('✅ Successfully fetched clinical notes:', {
          count: notesData?.length || 0,
          totalCount: count,
          sampleNote: notesData?.[0]
        });
        
        // Ensure we have valid data before processing
        if (!notesData || !Array.isArray(notesData)) {
          console.log('No notes data returned, returning empty result');
          return {
            data: [],
            totalCount: count || 0,
            currentPage: page,
            pageSize,
            totalPages: Math.ceil((count || 0) / pageSize)
          };
        }
        
        // Step 2: Enhance notes with client and provider data
        const enhancedNotes = await enhanceNotesWithClientAndProviderData(notesData);
        
        // Step 3: Validate and filter the data
        const validNotes = validateAndFilterNotes(enhancedNotes);
        
        const result = {
          data: validNotes,
          totalCount: count || 0,
          currentPage: page,
          pageSize,
          totalPages: Math.ceil((count || 0) / pageSize)
        };
        
        console.log('=== CLINICAL NOTES QUERY COMPLETED SUCCESSFULLY ===', result);
        return result;
        
      } catch (error) {
        console.error('=== CLINICAL NOTES QUERY FAILED ===');
        console.error('Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          error
        });
        
        // Re-throw with more context
        throw new Error(
          error instanceof Error 
            ? `Clinical notes query failed: ${error.message}` 
            : 'Clinical notes query failed with unknown error'
        );
      }
    },
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        console.log(`Query retry attempt ${failureCount}:`, error);
        // Only retry on network errors, not on permission/data errors
        return failureCount < 2 && 
               error instanceof Error && 
               (error.message.includes('network') || error.message.includes('timeout'));
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    }
  );
};
