
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import MessageThreadHeader from '../message-thread/MessageThreadHeader';
import MessagesList from '../message-thread/MessagesList';
import MessageInput from '../message-thread/MessageInput';
import EmptyThreadState from '../message-thread/EmptyThreadState';

interface MessageData {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  priority: string;
  sender: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

interface ConversationData {
  id: string;
  title: string;
  category: string;
  priority: string;
  client: {
    first_name: string;
    last_name: string;
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

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const { data: userRecord } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', userData.user.id)
        .single();
      
      if (!userRecord) throw new Error('User record not found');

      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: userRecord.id,
          content: content.trim(),
          priority: messagePriority,
        })
        .select()
        .single();

      if (error) throw error;

      // Update conversation's last_message_at
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversationId);

      return data;
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
