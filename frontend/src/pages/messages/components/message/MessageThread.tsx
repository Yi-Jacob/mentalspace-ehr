
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { messageService } from '@/services/messageService';
import { useToast } from '@/hooks/use-toast';
import MessageThreadHeader from '../message-thread/MessageThreadHeader';
import MessagesList from '../message-thread/MessagesList';
import MessageInput from '../message-thread/MessageInput';
import EmptyThreadState from '../message-thread/EmptyThreadState';

interface MessageData {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  priority: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface ConversationData {
  id: string;
  title: string;
  category: string;
  priority: string;
  client: {
    firstName: string;
    lastName: string;
  };
}

interface MessageThreadProps {
  messages: MessageData[];
  isLoading: boolean;
  conversationId: string | null;
  selectedConversation: ConversationData | undefined;
}

const MessageThread: React.FC<MessageThreadProps> = ({
  messages,
  isLoading,
  conversationId,
  selectedConversation,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [messagePriority, setMessagePriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!conversationId) throw new Error('No conversation selected');

      return messageService.sendMessage({
        conversationId,
        content: content.trim(),
        priority: messagePriority,
      });
    },
    onSuccess: () => {
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      setNewMessage('');
      setMessagePriority('normal');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      console.error('Send message error:', error);
    },
  });

  const handleSendMessage = () => {
    if (!newMessage.trim() || !conversationId) return;
    sendMessageMutation.mutate(newMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!conversationId) {
    return <EmptyThreadState />;
  }

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50/30 backdrop-blur-sm h-full flex flex-col">
      <MessageThreadHeader selectedConversation={selectedConversation} />

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4">
          <MessagesList messages={messages} isLoading={isLoading} />
        </div>

        {/* Message Input Area */}
        <MessageInput
          newMessage={newMessage}
          onMessageChange={setNewMessage}
          messagePriority={messagePriority}
          onPriorityChange={setMessagePriority}
          onSendMessage={handleSendMessage}
          onKeyPress={handleKeyPress}
          isLoading={sendMessageMutation.isPending}
          disabled={!newMessage.trim() || sendMessageMutation.isPending}
        />
      </CardContent>
    </Card>
  );
};

export default MessageThread;
