import { MessageSquare, Send, Plus, Users } from 'lucide-react';
import { Button } from '@/components/basic/button';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import ComposeMessageModal from './components/ComposeMessageModal';
import { useMessageManagementState } from './components/message-management/MessageManagementState';
import { useConversationsQuery } from './components/message-management/ConversationsQuery';
import { useMessagesQuery } from './components/message-management/MessagesQuery';
import ConversationList from './components/message/ConversationList';
import MessageThread from './components/message/MessageThread';
import { ConversationData } from '@/services/messageService';
import { useState, useEffect } from 'react';
import { useWebSocket } from '@/services/websocketService';
import { useQueryClient } from '@tanstack/react-query';

const MessageManagement = () => {
  const {
    selectedConversationId,
    setSelectedConversationId,
    showComposeModal,
    setShowComposeModal
  } = useMessageManagementState();

  const [conversationToEdit, setConversationToEdit] = useState<ConversationData | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const { connect, disconnect, webSocketService, isAuthReady } = useWebSocket();
  const queryClient = useQueryClient();

  const { data: conversations, isLoading: conversationsLoading } = useConversationsQuery();
  const { data: messages, isLoading: messagesLoading } = useMessagesQuery(selectedConversationId);

  const selectedConversation = conversations?.find(c => c.id === selectedConversationId);

  // Initialize WebSocket connection when auth is ready
  useEffect(() => {
    if (!isAuthReady) {
      console.log('🟠 Messages page: Auth not ready yet, waiting...');
      return;
    }
    connect();

    // Set up WebSocket event handlers - ONLY for new messages
    const handleNewMessage = (data: any) => {
      // Invalidate messages query for the specific conversation
      queryClient.invalidateQueries({ queryKey: ['messages', data.conversationId] });
      // Invalidate conversations query to update last message
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    };

    // Register event handlers
    webSocketService.onNewMessage(handleNewMessage);

    // Cleanup on unmount
    return () => {
      webSocketService.offNewMessage(handleNewMessage);
      disconnect();
    };
  }, [isAuthReady, connect, disconnect, webSocketService, queryClient]);

  const handleEditConversation = (conversation: ConversationData) => {
    setConversationToEdit(conversation);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setConversationToEdit(null);
  };

  return (
    <>
      <PageLayout variant="gradient">
        <PageHeader
          icon={MessageSquare}
          title="Messages"
          description="Secure communication with clients and team members"
          action={
            <div className="flex space-x-2">
              <Button 
                onClick={() => setShowComposeModal(true)}
                className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <Send className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </div>
          }
        />

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-180px)] min-h-0">
          <div className="lg:col-span-1 min-h-0">
            <ConversationList
              conversations={conversations || []}
              isLoading={conversationsLoading}
              selectedConversationId={selectedConversationId}
              onSelectConversation={setSelectedConversationId}
              onEditConversation={handleEditConversation}
            />
          </div>

          <div className="lg:col-span-3 min-h-0">
            <MessageThread
              messages={messages || []}
              isLoading={messagesLoading}
              conversationId={selectedConversationId}
              selectedConversation={selectedConversation}
            />
          </div>
        </div>
      </PageLayout>

      {/* New Message Modal */}
      <ComposeMessageModal 
        open={showComposeModal} 
        onOpenChange={setShowComposeModal} 
      />

      {/* Edit Conversation Modal */}
      <ComposeMessageModal 
        open={showEditModal} 
        onOpenChange={handleCloseEditModal}
        conversationToEdit={conversationToEdit}
      />
    </>
  );
};

export default MessageManagement;
