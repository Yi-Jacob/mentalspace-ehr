import { useQuery } from '@tanstack/react-query';
import { clientService } from '@/services/clientService';
import type { SelectOption } from '@/components/basic/select';
import { InsuranceInfoDto } from '@/types/clientType';

export const useClientInsurance = (clientId: string) => {
  return useQuery<InsuranceInfoDto[], Error, SelectOption[]>({
    queryKey: ['client-insurance', clientId],
    queryFn: () => clientService.getClientInsurance(clientId),
    enabled: !!clientId,
    select: (data) => data.map(insurance => ({
      value: insurance.id,
      label: `${insurance.insuranceCompany} (${insurance.insuranceType})`
    })),
  });
};