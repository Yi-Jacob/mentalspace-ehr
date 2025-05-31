
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useMessagesQuery = (selectedConversationId: string | null) => {
  return useQuery({
    queryKey: ['messages', selectedConversationId],
    queryFn: async () => {
      if (!selectedConversationId) return [];

      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          sender_id,
          priority,
          sender:users!messages_sender_id_fkey(
            id,
            first_name,
            last_name
          )
        `)
        .eq('conversation_id', selectedConversationId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedConversationId,
  });
};
