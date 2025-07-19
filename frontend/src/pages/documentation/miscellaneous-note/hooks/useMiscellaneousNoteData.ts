
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useMiscellaneousNoteData = (noteId?: string) => {
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
            last_name
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
