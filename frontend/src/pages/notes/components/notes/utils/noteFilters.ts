import { Note } from '@/types/note';

export interface FilterOptions {
  status?: string;
  noteType?: string;
  clientId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export const filterNotes = (notes: Note[], filters: FilterOptions): Note[] => {
  return notes.filter(note => {
    // Status filter
    if (filters.status && note.status !== filters.status) {
      return false;
    }

    // Note type filter
    if (filters.noteType && note.noteType !== filters.noteType) {
      return false;
    }

    // Client filter
    if (filters.clientId && note.clientId !== filters.clientId) {
      return false;
    }

    // Date range filter
    if (filters.dateRange) {
      const noteDate = new Date(note.createdAt);
      if (noteDate < filters.dateRange.start || noteDate > filters.dateRange.end) {
        return false;
      }
    }

    return true;
  });
};

export const sortNotes = (notes: Note[], sortBy: string, sortOrder: 'asc' | 'desc' = 'desc'): Note[] => {
  return [...notes].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortBy) {
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'noteType':
        aValue = a.noteType;
        bValue = b.noteType;
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      case 'updatedAt':
        aValue = new Date(a.updatedAt);
        bValue = new Date(b.updatedAt);
        break;
      case 'clientName':
        aValue = `${a.client?.firstName || ''} ${a.client?.lastName || ''}`.toLowerCase();
        bValue = `${b.client?.firstName || ''} ${b.client?.lastName || ''}`.toLowerCase();
        break;
      default:
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};
