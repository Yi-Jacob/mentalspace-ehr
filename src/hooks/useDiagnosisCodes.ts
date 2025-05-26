
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDiagnosisCodes = () => {
  return useQuery({
    queryKey: ['diagnosis-codes'],
    queryFn: async () => {
      // This would fetch from a diagnoses table when available
      // For now, return some common ICD-10 codes
      const commonDiagnoses = [
        { code: 'F32.9', description: 'Major depressive disorder, single episode, unspecified' },
        { code: 'F33.9', description: 'Major depressive disorder, recurrent, unspecified' },
        { code: 'F41.1', description: 'Generalized anxiety disorder' },
        { code: 'F41.9', description: 'Anxiety disorder, unspecified' },
        { code: 'F43.10', description: 'Post-traumatic stress disorder, unspecified' },
        { code: 'F84.0', description: 'Autistic disorder' },
        { code: 'F90.9', description: 'Attention-deficit hyperactivity disorder, unspecified type' },
        { code: 'F31.9', description: 'Bipolar disorder, unspecified' },
        { code: 'F20.9', description: 'Schizophrenia, unspecified' },
        { code: 'F50.9', description: 'Eating disorder, unspecified' },
      ];
      
      return commonDiagnoses.map(diagnosis => ({
        value: diagnosis.code,
        label: diagnosis.description,
        description: 'ICD-10',
      }));
    },
  });
};
