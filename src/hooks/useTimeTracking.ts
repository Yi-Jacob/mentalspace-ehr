
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TimeTrackingEntry {
  id: string;
  user_id: string;
  client_id?: string;
  start_time: string;
  end_time?: string;
  break_duration_minutes: number;
  total_hours?: number;
  activity_type: string;
  description?: string;
  is_billable: boolean;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export const useTimeTracking = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: timeEntries, isLoading } = useQuery({
    queryKey: ['time-tracking'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('time_tracking')
        .select('*')
        .order('start_time', { ascending: false });

      if (error) throw error;
      return data as TimeTrackingEntry[];
    },
  });

  const startTimer = useMutation({
    mutationFn: async ({ client_id, activity_type, description }: {
      client_id?: string;
      activity_type: string;
      description?: string;
    }) => {
      const { data: userInfo } = await supabase.rpc('get_current_user_info');
      if (!userInfo?.[0]) throw new Error('User not found');

      const { data, error } = await supabase
        .from('time_tracking')
        .insert({
          user_id: userInfo[0].user_id,
          client_id,
          start_time: new Date().toISOString(),
          activity_type,
          description,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-tracking'] });
      toast({ title: 'Timer started successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const stopTimer = useMutation({
    mutationFn: async ({ id, break_duration_minutes = 0 }: {
      id: string;
      break_duration_minutes?: number;
    }) => {
      const endTime = new Date();
      const { data: entry } = await supabase
        .from('time_tracking')
        .select('start_time')
        .eq('id', id)
        .single();

      if (!entry) throw new Error('Entry not found');

      const startTime = new Date(entry.start_time);
      const totalHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60) - (break_duration_minutes / 60);

      const { data, error } = await supabase
        .from('time_tracking')
        .update({
          end_time: endTime.toISOString(),
          break_duration_minutes,
          total_hours: Math.round(totalHours * 100) / 100,
          status: 'completed'
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-tracking'] });
      toast({ title: 'Timer stopped successfully' });
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
    timeEntries,
    isLoading,
    startTimer,
    stopTimer,
    isStarting: startTimer.isPending,
    isStopping: stopTimer.isPending,
  };
};
