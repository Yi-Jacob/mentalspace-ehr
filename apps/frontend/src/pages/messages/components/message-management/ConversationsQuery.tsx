
import { useQuery } from '@tanstack/react-query';
import { messageService } from '@/services/messageService';

export const useConversationsQuery = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      return messageService.getConversations();
    },
  });
};
