import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Plus, Users } from 'lucide-react';
import { Button } from '@/components/basic/button';
import ComposeMessageModal from '@/pages/messages/components/ComposeMessageModal';
import { useMessageManagementState } from '@/pages/messages/components/message-management/MessageManagementState';
import { useConversationsQuery } from '@/pages/messages/components/message-management/ConversationsQuery';
import { useMessagesQuery } from '@/pages/messages/components/message-management/MessagesQuery';
import ConversationList from '@/pages/messages/components/message/ConversationList';
import MessageThread from '@/pages/messages/components/message/MessageThread';
import { ConversationData } from '@/services/messageService';
import { useWebSocket } from '@/services/websocketService';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { messageService } from '@/services/messageService';
import { useQuery } from '@tanstack/react-query';

interface MessageComponentProps {
  clientId?: string; // Optional - if provided, shows conversations for this specific client
  showHeader?: boolean; // Optional - whether to show the header with "New Message" button
  className?: string; // Optional - additional CSS classes
}

const MessageComponent: React.FC<MessageComponentProps> = ({ 
  clientId, 
  showHeader = true, 
  className = "" 
}) => {
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
  const { user } = useAuth();

  // Use different query based on whether we're showing client-specific conversations
  const { data: conversations, isLoading: conversationsLoading } = clientId 
    ? useQuery({
        queryKey: ['conversations', 'client', clientId],
        queryFn: () => messageService.getClientConversations(clientId),
        enabled: !!clientId,
      })
    : useConversationsQuery();

  const { data: messages, isLoading: messagesLoading } = useMessagesQuery(selectedConversationId);

  const selectedConversation = conversations?.find(c => c.id === selectedConversationId);

  // Initialize WebSocket connection when auth is ready
  useEffect(() => {
    if (!isAuthReady) {
      console.log('🟠 MessageComponent: Auth not ready yet, waiting...');
      return;
    }
    connect();

    // Set up WebSocket event handlers - ONLY for new messages
    const handleNewMessage = (data: any) => {
      // Invalidate messages query for the specific conversation
      queryClient.invalidateQueries({ queryKey: ['messages', data.conversationId] });
      // Invalidate conversations query to update last message
      if (clientId) {
        queryClient.invalidateQueries({ queryKey: ['conversations', 'client', clientId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      }
    };

    // Register event handlers
    webSocketService.onNewMessage(handleNewMessage);

    // Cleanup on unmount
    return () => {
      webSocketService.offNewMessage(handleNewMessage);
      disconnect();
    };
  }, [isAuthReady, connect, disconnect, webSocketService, queryClient, clientId]);

  const handleEditConversation = (conversation: ConversationData) => {
    setConversationToEdit(conversation);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setConversationToEdit(null);
  };

  // Check if user can create new messages
  const canCreateMessage = user?.roles?.includes('practice_admin') || 
                          user?.roles?.includes('admin') || 
                          user?.roles?.includes('therapist') ||
                          user?.roles?.includes('staff');

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              {clientId ? 'Client Messages' : 'Messages'}
            </h2>
          </div>
          {canCreateMessage && (
            <Button 
              onClick={() => setShowComposeModal(true)}
              className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Send className="h-4 w-4 mr-2" />
              New Message
            </Button>
          )}
        </div>
      )}

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-0">
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

      {/* New Message Modal */}
      <ComposeMessageModal 
        open={showComposeModal} 
        onOpenChange={setShowComposeModal}
        preselectedClientId={clientId} // Pass clientId to pre-select the client
      />

      {/* Edit Conversation Modal */}
      <ComposeMessageModal 
        open={showEditModal} 
        onOpenChange={handleCloseEditModal}
        conversationToEdit={conversationToEdit}
      />
    </div>
  );
};

export default MessageComponent;
