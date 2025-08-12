
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api-helper/client';
import { DiagnosisOption } from '@/types/noteType';

export const useDiagnosesData = () => {
  return useQuery({
    queryKey: ['diagnoses-data'],
    queryFn: async () => {
      const response = await apiClient.get<DiagnosisOption[]>('/diagnoses');
      return response.data;
    },
  });
};
