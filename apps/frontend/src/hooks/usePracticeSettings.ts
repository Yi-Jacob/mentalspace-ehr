
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { practiceSettingsService, PracticeSettings } from '@/services/practiceSettingsService';
import { useToast } from '@/hooks/use-toast';

export const usePracticeSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current user's settings
  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['practice-settings'],
    queryFn: async () => {
      return practiceSettingsService.getPracticeSettings();
    },
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (updates: PracticeSettings) => {
      if (settings?.id) {
        // Update existing settings
        return practiceSettingsService.updatePracticeSettings(updates);
      } else {
        // Create new settings
        return practiceSettingsService.upsertPracticeSettings(updates);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['practice-settings'] });
      toast({
        title: 'Settings Saved',
        description: 'Your practice settings have been updated successfully.',
      });
    },
    onError: (error) => {
      console.error('Error updating practice settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const updateSettings = (updates: PracticeSettings) => {
    updateSettingsMutation.mutate(updates);
  };

  return {
    settings,
    isLoading,
    error,
    updateSettings,
    isUpdating: updateSettingsMutation.isPending,
  };
};
