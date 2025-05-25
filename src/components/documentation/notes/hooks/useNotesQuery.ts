
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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

export const useNotesQuery = (statusFilter: NoteStatus, typeFilter: NoteType) => {
  return useQuery({
    queryKey: ['clinical-notes', statusFilter, typeFilter],
    queryFn: async () => {
      let query = supabase
        .from('clinical_notes')
        .select(`
          *,
          clients!inner(first_name, last_name),
          provider:users!clinical_notes_provider_id_fkey(first_name, last_name)
        `)
        .order('updated_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (typeFilter !== 'all') {
        query = query.eq('note_type', typeFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ClinicalNote[];
    },
  });
};
