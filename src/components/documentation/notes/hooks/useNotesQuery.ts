
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useOptimizedQuery } from '@/hooks/useOptimizedQuery';

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
  const selectClause = fields.join(', ');

  return useOptimizedQuery(
    ['clinical-notes', statusFilter, typeFilter, page.toString(), pageSize.toString()],
    async () => {
      console.log('=== STARTING CLINICAL NOTES QUERY ===');
      console.log('Query parameters:', { statusFilter, typeFilter, page, pageSize });
      
      try {
        // Step 1: Fetch clinical notes with basic fields only
        let query = supabase
          .from('clinical_notes')
          .select(selectClause, { count: 'exact' })
          .order('updated_at', { ascending: false });

        if (statusFilter !== 'all') {
          query = query.eq('status', statusFilter);
        }

        if (typeFilter !== 'all') {
          query = query.eq('note_type', typeFilter);
        }

        // Add pagination
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);

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
        
        // Step 2: Enhanced notes with safer client and provider information fetching
        console.log('Enhancing notes with client and provider data...');
        const enhancedNotes = await Promise.all(
          notesData.map(async (note: any) => {
            let clientInfo = null;
            let providerInfo = null;
            
            // Fetch client information with better error handling
            if (note.client_id) {
              try {
                console.log(`Fetching client info for note ${note.id}, client_id: ${note.client_id}`);
                const { data: clientData, error: clientError } = await supabase
                  .from('clients')
                  .select('first_name, last_name')
                  .eq('id', note.client_id)
                  .maybeSingle();
                
                if (clientError) {
                  console.warn(`⚠️ Client fetch error for note ${note.id}:`, clientError);
                } else if (clientData) {
                  clientInfo = clientData;
                  console.log(`✅ Client data fetched for note ${note.id}`);
                } else {
                  console.log(`ℹ️ No client found for note ${note.id}, client_id: ${note.client_id}`);
                }
              } catch (clientError) {
                console.warn(`⚠️ Client fetch exception for note ${note.id}:`, clientError);
              }
            }
            
            // Fetch provider information with better error handling
            if (note.provider_id) {
              try {
                console.log(`Fetching provider info for note ${note.id}, provider_id: ${note.provider_id}`);
                const { data: providerData, error: providerError } = await supabase
                  .from('users')
                  .select('first_name, last_name')
                  .eq('id', note.provider_id)
                  .maybeSingle();
                
                if (providerError) {
                  console.warn(`⚠️ Provider fetch error for note ${note.id}:`, providerError);
                } else if (providerData) {
                  providerInfo = providerData;
                  console.log(`✅ Provider data fetched for note ${note.id}`);
                } else {
                  console.log(`ℹ️ No provider found for note ${note.id}, provider_id: ${note.provider_id}`);
                }
              } catch (providerError) {
                console.warn(`⚠️ Provider fetch exception for note ${note.id}:`, providerError);
              }
            }
            
            return {
              ...note,
              clients: clientInfo,
              provider: providerInfo
            };
          })
        );
        
        // Validate and filter data to ensure it matches ClinicalNote interface
        const validNotes: ClinicalNote[] = enhancedNotes
          .filter((item: any): item is NonNullable<typeof item> => 
            item !== null && 
            item !== undefined &&
            typeof item === 'object' && 
            'id' in item && 
            'title' in item && 
            'note_type' in item && 
            'status' in item
          )
          .map((item: any): ClinicalNote => ({
            id: item.id,
            title: item.title,
            note_type: item.note_type,
            status: item.status,
            created_at: item.created_at,
            updated_at: item.updated_at,
            client_id: item.client_id,
            clients: item.clients,
            provider: item.provider
          }));
        
        console.log('✅ Successfully enhanced notes with client/provider data:', {
          originalCount: notesData.length,
          validCount: validNotes.length,
          totalCount: count
        });
        
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
