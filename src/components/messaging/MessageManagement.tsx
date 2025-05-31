
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import MessageHeader from './message/MessageHeader';
import ConversationList from './message/ConversationList';
import MessageThread from './message/MessageThread';
import ComposeMessageModal from './ComposeMessageModal';
import NewConversationModal from './NewConversationModal';

const MessageManagement = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showNewConversationModal, setShowNewConversationModal] = useState(false);

  const { data: conversations, isLoading: conversationsLoading } = useQuery({
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
        .from('conversations' as any)
        .select(`
          *,
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

  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ['messages', selectedConversationId],
    queryFn: async () => {
      if (!selectedConversationId) return [];

      const { data, error } = await supabase
        .from('messages' as any)
        .select(`
          *,
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

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-white to-blue-50/30 p-6">
        <MessageHeader
          onCompose={() => setShowComposeModal(true)}
          onNewConversation={() => setShowNewConversationModal(true)}
        />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          <div className="lg:col-span-1">
            <ConversationList
              conversations={conversations || []}
              isLoading={conversationsLoading}
              selectedConversationId={selectedConversationId}
              onSelectConversation={setSelectedConversationId}
            />
          </div>

          <div className="lg:col-span-2">
            <MessageThread
              messages={messages || []}
              isLoading={messagesLoading}
              conversationId={selectedConversationId}
              selectedConversation={conversations?.find(c => c.id === selectedConversationId)}
            />
          </div>
        </div>
      </div>

      <ComposeMessageModal 
        open={showComposeModal} 
        onOpenChange={setShowComposeModal} 
      />
      <NewConversationModal 
        open={showNewConversationModal} 
        onOpenChange={setShowNewConversationModal} 
      />
    </>
  );
};

export default MessageManagement;
