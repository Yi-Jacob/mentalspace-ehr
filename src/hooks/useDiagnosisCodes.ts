
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDiagnosisCodes = () => {
  return useQuery({
    queryKey: ['diagnosis-codes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('diagnosis_codes')
        .select('code, description, category')
        .eq('is_active', true)
        .order('code');
      
      if (error) throw error;
      
      return data.map(diagnosis => ({
        value: diagnosis.code,
        label: diagnosis.description,
        description: diagnosis.category,
      }));
    },
  });
};
