
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCptCodes = () => {
  return useQuery({
    queryKey: ['cpt-codes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cpt_codes')
        .select('code, description, category')
        .eq('is_active', true)
        .order('code');
      
      if (error) throw error;
      
      return data.map(cpt => ({
        value: cpt.code,
        label: cpt.description,
        description: cpt.category,
      }));
    },
  });
};
