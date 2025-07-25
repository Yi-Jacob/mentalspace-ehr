
import { noteService } from '@/services/noteService';

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
  const { page, pageSize } = options;
  
  // Build query parameters for the backend API
  const params = new URLSearchParams();
  if (statusFilter !== 'all') {
    params.append('status', statusFilter);
  }
  if (typeFilter !== 'all') {
    params.append('noteType', typeFilter);
  }
  params.append('page', page.toString());
  params.append('limit', pageSize.toString());

  // Return a function that can be called to execute the query
  return async () => {
    const response = await noteService.getNotes({ 
      status: statusFilter !== 'all' ? statusFilter : undefined,
      noteType: typeFilter !== 'all' ? typeFilter : undefined,
      page,
      limit: pageSize
    });
    return response;
  };
};
