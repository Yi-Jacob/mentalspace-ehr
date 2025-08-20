
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/basic/card';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { messageService, ConversationData } from '@/services/messageService';
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



  if (!conversationId) {
    return <EmptyThreadState />;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
      {selectedConversation ? (
        <>
          <MessageThreadHeader conversation={selectedConversation} />
          
          <div className="flex-1 overflow-hidden">
            <MessagesList
              messages={messages}
              isLoading={isLoading}
              conversationId={conversationId}
            />
          </div>
          
          <div className="border-t border-gray-200 p-4">
            <MessageInput
              value={newMessage}
              onChange={setNewMessage}
              onSend={handleSendMessage}
              priority="normal"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              conversationId={conversationId}
              replyToId={null}
              onCancelReply={() => {}}
              disabled={sendMessageMutation.isPending}
              isLoading={sendMessageMutation.isPending}
            />
          </div>
        </>
      ) : (
        <EmptyThreadState />
      )}
    </div>
  );
};

export default MessageThread;
