
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/basic/card';
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
  replyToId?: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
  };
  replyTo?: {
    id: string;
    content: string;
    sender: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
  readReceipts: {
    id: string;
    readAt: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
    };
  }[];
}

interface ConversationData {
  id: string;
  title: string;
  type: 'individual' | 'group';
  category: string;
  priority: string;
  client?: {
    firstName: string;
    lastName: string;
  };
  therapist?: {
    firstName: string;
    lastName: string;
  };
  participants?: {
    id: string;
    role: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
    };
  }[];
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
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!conversationId) throw new Error('No conversation selected');

      return messageService.sendMessage({
        conversationId,
        content: content.trim(),
        priority: messagePriority,
        replyToId: replyToId || undefined,
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
      setReplyToId(null);
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

  const handleReply = (messageId: string) => {
    setReplyToId(messageId);
  };

  const handleCancelReply = () => {
    setReplyToId(null);
  };

  if (!conversationId) {
    return <EmptyThreadState />;
  }

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm h-full flex flex-col">
      <MessageThreadHeader 
        conversation={selectedConversation}
        isLoading={isLoading}
      />
      
      <CardContent className="flex-1 p-0 flex flex-col">
        <MessagesList
          messages={messages}
          isLoading={isLoading}
          onReply={handleReply}
          replyToId={replyToId}
        />
        
        <MessageInput
          value={newMessage}
          onChange={setNewMessage}
          onSend={handleSendMessage}
          onKeyPress={handleKeyPress}
          priority={messagePriority}
          replyToId={replyToId}
          onCancelReply={handleCancelReply}
          disabled={sendMessageMutation.isPending}
          isLoading={sendMessageMutation.isPending}
        />
      </CardContent>
    </Card>
  );
};

export default MessageThread;
