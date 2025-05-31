
import React from 'react';
import MessageHeader from './message/MessageHeader';
import ConversationList from './message/ConversationList';
import MessageThread from './message/MessageThread';
import ComposeMessageModal from './ComposeMessageModal';
import NewConversationModal from './NewConversationModal';
import { useConversationsQuery } from './message-management/ConversationsQuery';
import { useMessagesQuery } from './message-management/MessagesQuery';
import { useMessageManagementState } from './message-management/MessageManagementState';

const MessageManagement = () => {
  const {
    selectedConversationId,
    setSelectedConversationId,
    showComposeModal,
    setShowComposeModal,
    showNewConversationModal,
    setShowNewConversationModal,
  } = useMessageManagementState();

  const { data: conversations, isLoading: conversationsLoading } = useConversationsQuery();
  const { data: messages, isLoading: messagesLoading } = useMessagesQuery(selectedConversationId);

  const selectedConversation = conversations?.find(c => c.id === selectedConversationId);

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
              selectedConversation={selectedConversation}
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
