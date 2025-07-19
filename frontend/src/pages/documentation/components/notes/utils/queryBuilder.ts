
import { supabase } from '@/integrations/supabase/client';

type NoteStatus = 'all' | 'draft' | 'signed' | 'submitted_for_review' | 'approved' | 'rejected' | 'locked';
type NoteType = 'all' | 'intake' | 'progress_note' | 'treatment_plan' | 'cancellation_note' | 'contact_note' | 'consultation_note' | 'miscellaneous_note';

interface QueryOptions {
  page: number;
  pageSize: number;
  selectFields: string[];
}

export const buildNotesQuery = (
  statusFilter: NoteStatus,
  typeFilter: NoteType,
  options: QueryOptions
) => {
  const { page, pageSize, selectFields } = options;
  const selectClause = selectFields.join(', ');

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

  return query;
};
