
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

export const validateAndFilterNotes = (enhancedNotes: any[]): ClinicalNote[] => {
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
    originalCount: enhancedNotes.length,
    validCount: validNotes.length
  });
  
  return validNotes;
};
