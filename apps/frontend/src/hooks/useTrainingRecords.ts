
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trainingRecordsService, TrainingRecord, CreateTrainingRecordRequest, UpdateTrainingRecordRequest } from '@/services/trainingRecordsService';
import { useToast } from '@/hooks/use-toast';

export const useTrainingRecords = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: trainingRecords, isLoading } = useQuery({
    queryKey: ['training-records'],
    queryFn: async () => {
      return trainingRecordsService.getTrainingRecords();
    },
  });

  const addTrainingRecord = useMutation({
    mutationFn: async (record: CreateTrainingRecordRequest) => {
      return trainingRecordsService.createTrainingRecord(record);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-records'] });
      toast({ title: 'Training record added successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateTrainingRecord = useMutation({
    mutationFn: async ({ id, ...updates }: UpdateTrainingRecordRequest & { id: string }) => {
      return trainingRecordsService.updateTrainingRecord(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-records'] });
      toast({ title: 'Training record updated successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    trainingRecords,
    isLoading,
    addTrainingRecord,
    updateTrainingRecord,
    isAdding: addTrainingRecord.isPending,
    isUpdating: updateTrainingRecord.isPending,
  };
};
