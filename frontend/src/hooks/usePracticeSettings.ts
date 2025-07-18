
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface PracticeSettings {
  id?: string;
  user_id?: string;
  practice_name?: string;
  practice_address?: Record<string, any>;
  practice_contact?: Record<string, any>;
  business_hours?: Record<string, any>;
  security_settings?: Record<string, any>;
  portal_settings?: Record<string, any>;
  scheduling_settings?: Record<string, any>;
  documentation_settings?: Record<string, any>;
  billing_settings?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

// Helper function to safely convert JSONB to object
const safeJsonToObject = (value: any): Record<string, any> => {
  if (value === null || value === undefined) {
    return {};
  }
  if (typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, any>;
  }
  // If it's a string, try to parse it as JSON
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }
  return {};
};

export const usePracticeSettings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get current user's settings
  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['practice-settings', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (!userData) return null;

      const { data, error } = await supabase
        .from('practice_settings')
        .select('*')
        .eq('user_id', userData.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching practice settings:', error);
        throw error;
      }

      // Safely convert all JSONB fields to objects
      if (data) {
        return {
          ...data,
          practice_address: safeJsonToObject(data.practice_address),
          practice_contact: safeJsonToObject(data.practice_contact),
          business_hours: safeJsonToObject(data.business_hours),
          security_settings: safeJsonToObject(data.security_settings),
          portal_settings: safeJsonToObject(data.portal_settings),
          scheduling_settings: safeJsonToObject(data.scheduling_settings),
          documentation_settings: safeJsonToObject(data.documentation_settings),
          billing_settings: safeJsonToObject(data.billing_settings),
        };
      }

      return data;
    },
    enabled: !!user,
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (updates: Partial<PracticeSettings>) => {
      if (!user) throw new Error('User not authenticated');

      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (!userData) throw new Error('User not found');

      if (settings?.id) {
        // Update existing settings
        const { data, error } = await supabase
          .from('practice_settings')
          .update(updates)
          .eq('id', settings.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new settings
        const { data, error } = await supabase
          .from('practice_settings')
          .insert({ user_id: userData.id, ...updates })
          .select()
          .single();

        if (error) throw error;
        return data;
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

  const updateSettings = (updates: Partial<PracticeSettings>) => {
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
