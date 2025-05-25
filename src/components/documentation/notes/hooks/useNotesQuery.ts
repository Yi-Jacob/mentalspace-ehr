
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

  // Optimized field selection - only fetch what we need
  const defaultFields = [
    'id',
    'title', 
    'note_type',
    'status',
    'created_at',
    'updated_at',
    'client_id'
  ];

  const fields = selectFields || defaultFields;
  const selectClause = [
    ...fields,
    'clients!inner(first_name, last_name)',
    'provider:users!clinical_notes_provider_id_fkey(first_name, last_name)'
  ].join(', ');

  return useOptimizedQuery(
    ['clinical-notes', statusFilter, typeFilter, page, pageSize],
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
      
      return {
        data: data as ClinicalNote[],
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
