
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DiagnosisOption {
  code: string;
  description: string;
}

export const useDiagnosesData = () => {
  return useQuery({
    queryKey: ['diagnoses-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('diagnosis_codes')
        .select('code, description')
        .eq('is_active', true)
        .order('code');
      
      if (error) throw error;
      
      return data;
    },
  });
};
