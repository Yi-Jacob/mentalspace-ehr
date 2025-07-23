
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useContactNoteData = (noteId?: string) => {
  return useQuery({
    queryKey: ['clinical-note', noteId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clinical_notes')
        .select(`
          *,
          clients (
            id,
            first_name,
            last_name,
            date_of_birth,
            email,
            address_1,
            address_2,
            city,
            state,
            zip_code,
            gender_identity
          )
        `)
        .eq('id', noteId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!noteId,
  });
};
