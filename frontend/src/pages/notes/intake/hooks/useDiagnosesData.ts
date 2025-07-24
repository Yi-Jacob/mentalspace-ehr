
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api-helper/client';

export interface DiagnosisOption {
  code: string;
  description: string;
}

export const useDiagnosesData = () => {
  return useQuery({
    queryKey: ['diagnoses-data'],
    queryFn: async () => {
      const response = await apiClient.get<DiagnosisOption[]>('/diagnoses');
      return response.data;
    },
  });
};
