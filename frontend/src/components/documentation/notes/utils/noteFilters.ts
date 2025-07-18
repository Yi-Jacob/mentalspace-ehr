
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

export const filterNotesBySearch = (notes: ClinicalNote[] | undefined, searchTerm: string): ClinicalNote[] => {
  if (!notes) return [];
  
  return notes.filter(note =>
    searchTerm === '' || 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${note.clients?.first_name} ${note.clients?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
};
