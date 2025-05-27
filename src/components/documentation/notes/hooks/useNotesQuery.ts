
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

  // Simplified field selection - only fetch basic note data first
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
      console.log('Fetching clinical notes with simplified query...');
      
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

      const { data: notesData, error, count } = await query;
      
      if (error) {
        console.error('Error fetching clinical notes:', error);
        throw error;
      }
      
      console.log('Successfully fetched clinical notes:', notesData?.length || 0);
      
      // Ensure we have valid data before processing
      if (!notesData || !Array.isArray(notesData)) {
        return {
          data: [],
          totalCount: count || 0,
          currentPage: page,
          pageSize,
          totalPages: Math.ceil((count || 0) / pageSize)
        };
      }
      
      // Step 2: Enhance notes with client and provider information
      const enhancedNotes = await Promise.all(
        notesData.map(async (note: any) => {
          let clientInfo = null;
          let providerInfo = null;
          
          // Fetch client information separately
          if (note.client_id) {
            try {
              const { data: clientData } = await supabase
                .from('clients')
                .select('first_name, last_name')
                .eq('id', note.client_id)
                .single();
              
              if (clientData) {
                clientInfo = clientData;
              }
            } catch (clientError) {
              console.warn('Could not fetch client info for note:', note.id, clientError);
              // Continue without client info rather than failing
            }
          }
          
          // Fetch provider information separately
          if (note.provider_id) {
            try {
              const { data: providerData } = await supabase
                .from('users')
                .select('first_name, last_name')
                .eq('id', note.provider_id)
                .single();
              
              if (providerData) {
                providerInfo = providerData;
              }
            } catch (providerError) {
              console.warn('Could not fetch provider info for note:', note.id, providerError);
              // Continue without provider info rather than failing
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
      
      console.log('Successfully enhanced notes with client/provider data:', validNotes.length);
      
      return {
        data: validNotes,
        totalCount: count || 0,
        currentPage: page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize)
      };
    },
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    }
  );
};
