
import { useQuery } from '@tanstack/react-query';
import { billingService } from '@/services/billingService';

export const useCptCodes = () => {
  return useQuery({
    queryKey: ['cpt-codes'],
    queryFn: async () => {
      const data = await billingService.getCptCodes();
      
      return data.map(cpt => ({
        value: cpt.code,
        label: cpt.description,
        description: cpt.description, // Using description as category since backend doesn't have category field
      }));
    },
  });
};
