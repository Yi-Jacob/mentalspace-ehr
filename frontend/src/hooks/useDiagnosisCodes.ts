
import { useQuery } from '@tanstack/react-query';
import { diagnosesService } from '@/services/diagnosesService';

export const useDiagnosisCodes = (search?: string) => {
  return useQuery({
    queryKey: ['diagnosis-codes', search],
    queryFn: async () => {
      const data = await diagnosesService.getDiagnosisCodes(search);
      
      return data.map(diagnosis => ({
        value: diagnosis.code,
        label: diagnosis.description,
        description: diagnosis.category || '',
      }));
    },
  });
};
