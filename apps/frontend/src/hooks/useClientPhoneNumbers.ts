import { useQuery } from '@tanstack/react-query';
import { clientService } from '@/services/clientService';
import type { SelectOption } from '@/components/basic/select';
import { PhoneNumberDto } from '@/types/clientType';


export const useClientPhoneNumbers = (clientId: string) => {
  return useQuery<PhoneNumberDto[], Error, SelectOption[]>({
    queryKey: ['client-phone-numbers', clientId],
    queryFn: () => clientService.getClientPhoneNumbers(clientId),
    enabled: !!clientId,
    select: (data) => data.map(phone => {
      return {
      value: phone.id,
      label: `${phone.phoneNumber} (${phone.phoneType})`
    }}),
  });
};