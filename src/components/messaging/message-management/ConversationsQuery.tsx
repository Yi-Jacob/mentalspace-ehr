
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useConversationsQuery = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const { data: userRecord } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', userData.user.id)
        .single();
      
      if (!userRecord) throw new Error('User record not found');

      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id,
          title,
          category,
          priority,
          status,
          last_message_at,
          client:clients!conversations_client_id_fkey(
            id,
            first_name,
            last_name
          ),
          messages(
            id,
            content,
            created_at,
            sender_id,
            sender:users!messages_sender_id_fkey(first_name, last_name)
          )
        `)
        .eq('therapist_id', userRecord.id)
        .order('last_message_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};
