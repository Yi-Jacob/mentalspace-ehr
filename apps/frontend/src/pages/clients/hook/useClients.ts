import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { clientService } from '@/services/clientService';
import { 
  ClientFormData, 
  PhoneNumber, 
  EmergencyContact, 
  InsuranceInfo, 
  PrimaryCareProvider 
} from '@/types/clientType';

export const useClients = (options?: {
  onCreateSuccess?: () => void;
  onUpdateSuccess?: () => void;
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query for all clients
  const {
    data: clients = [],
    isLoading,
    error,
    refetch: refetchClients,
  } = useQuery({
    queryKey: ['clients', 'active'],
    queryFn: async () => {
      return await clientService.getClients();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Mutation for creating a client with form data
  const createClientMutation = useMutation({
    mutationFn: async (data: {
      formData: ClientFormData;
      phoneNumbers: PhoneNumber[];
      emergencyContacts: EmergencyContact[];
      insuranceInfo: InsuranceInfo[];
      primaryCareProvider: PrimaryCareProvider;
    }) => {
      return await clientService.createClientWithFormData(
        data.formData,
        data.phoneNumbers,
        data.emergencyContacts,
        data.insuranceInfo,
        data.primaryCareProvider
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['clients', 'active'] });
      toast({
        title: 'Success',
        description: 'Client created successfully',
      });
      options?.onCreateSuccess?.();
    },
    onError: (error: any) => {
      console.error('Client creation error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create client',
        variant: 'destructive',
      });
    },
  });

  // Mutation for updating a client with form data
  const updateClientMutation = useMutation({
    mutationFn: async ({ 
      clientId, 
      data 
    }: { 
      clientId: string; 
      data: {
        formData: Partial<ClientFormData>;
        phoneNumbers: PhoneNumber[];
        emergencyContacts: EmergencyContact[];
        insuranceInfo: InsuranceInfo[];
        primaryCareProvider: PrimaryCareProvider;
      };
    }) => {
      return await clientService.updateClientWithFormData(
        clientId,
        data.formData,
        data.phoneNumbers,
        data.emergencyContacts,
        data.insuranceInfo,
        data.primaryCareProvider
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['clients', 'active'] });
      toast({
        title: 'Success',
        description: 'Client updated successfully',
      });
      options?.onUpdateSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update client',
        variant: 'destructive',
      });
    },
  });

  // Mutation for deleting a client
  const deleteClientMutation = useMutation({
    mutationFn: async (clientId: string) => {
      return await clientService.deleteClient(clientId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['clients', 'active'] });
      toast({
        title: 'Success',
        description: 'Client deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete client',
        variant: 'destructive',
      });
    },
  });

  return {
    clients,
    isLoading,
    error,
    refetchClients,
    createClient: createClientMutation.mutate,
    updateClient: updateClientMutation.mutate,
    deleteClient: deleteClientMutation.mutate,
    isCreating: createClientMutation.isPending,
    isUpdating: updateClientMutation.isPending,
    isDeleting: deleteClientMutation.isPending,
  };
}; 