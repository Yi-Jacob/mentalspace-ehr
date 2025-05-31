
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Send, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
        .from('messages' as any)
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
        .from('conversations' as any)
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

  const getPriorityIcon = (priority: string) => {
    if (priority === 'urgent' || priority === 'high') {
      return <AlertCircle className="h-3 w-3 text-red-500" />;
    }
    return null;
  };

  if (!conversationId) {
    return (
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50/30 backdrop-blur-sm h-full">
        <CardContent className="p-6 flex items-center justify-center h-full">
          <div className="text-center text-gray-500">
            <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
            <p className="text-sm">Choose a client conversation from the list to start messaging</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50/30 backdrop-blur-sm h-full flex flex-col">
      <CardHeader className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center space-x-2 text-xl">
          <MessageSquare className="h-5 w-5" />
          <span>{selectedConversation?.title || 'Conversation'}</span>
        </CardTitle>
        {selectedConversation && (
          <div className="flex items-center justify-between text-purple-100 text-sm">
            <span>Client: {selectedConversation.client.first_name} {selectedConversation.client.last_name}</span>
            <div className="flex items-center space-x-2">
              <span className="capitalize">{selectedConversation.category}</span>
              <span>•</span>
              <span className="capitalize">{selectedConversation.priority}</span>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                <div className="text-gray-600 font-medium">Loading messages...</div>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
              <p className="text-sm">Start the conversation by sending a message below</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="space-y-2">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-800">
                        {message.sender.first_name} {message.sender.last_name}
                      </span>
                      {getPriorityIcon(message.priority)}
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{format(new Date(message.created_at), 'MMM d, h:mm a')}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input Area */}
        <div className="border-t border-gray-200 p-4 bg-gradient-to-r from-gray-50 to-purple-50/50">
          <div className="flex flex-col space-y-3">
            <div className="flex space-x-2">
              <Select value={messagePriority} onValueChange={(value: any) => setMessagePriority(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-3">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message to the client..."
                className="flex-1 resize-none min-h-[60px] border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                disabled={sendMessageMutation.isPending}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || sendMessageMutation.isPending}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 self-end"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessageThread;
