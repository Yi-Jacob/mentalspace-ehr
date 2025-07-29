
import { useQuery } from '@tanstack/react-query';
import { messageService } from '@/services/messageService';

export const useMessagesQuery = (selectedConversationId: string | null) => {
  return useQuery({
    queryKey: ['messages', selectedConversationId],
    queryFn: async () => {
      if (!selectedConversationId) return [];
      return messageService.getMessages(selectedConversationId);
    },
    enabled: !!selectedConversationId,
  });
};
