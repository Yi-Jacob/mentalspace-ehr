
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

  // Optimized field selection - only fetch what we need, avoiding problematic joins
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
  
  // Remove the problematic provider join that causes infinite recursion
  const selectClause = [
    ...fields,
    'clients!inner(first_name, last_name)'
  ].join(', ');

  return useOptimizedQuery(
    ['clinical-notes', statusFilter, typeFilter, page.toString(), pageSize.toString()],
    async () => {
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

      const { data, error, count } = await query;
      if (error) throw error;
      
      // Ensure we have valid data before processing
      if (!data || !Array.isArray(data)) {
        return {
          data: [],
          totalCount: count || 0,
          currentPage: page,
          pageSize,
          totalPages: Math.ceil((count || 0) / pageSize)
        };
      }
      
      // Get provider information separately to avoid RLS issues
      const notesWithProviders = await Promise.all(
        data.map(async (note: any) => {
          let providerInfo = null;
          
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
              console.warn('Could not fetch provider info:', providerError);
              // Continue without provider info rather than failing
            }
          }
          
          return {
            ...note,
            provider: providerInfo
          };
        })
      );
      
      // Validate and filter data to ensure it matches ClinicalNote interface
      const validNotes: ClinicalNote[] = notesWithProviders
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
