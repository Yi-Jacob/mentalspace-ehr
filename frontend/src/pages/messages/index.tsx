import ComposeMessageModal from './components/ComposeMessageModal';
import NewConversationModal from './components/NewConversationModal';
import { useMessageManagementState } from './components/message-management/MessageManagementState';
import { useConversationsQuery } from './components/message-management/ConversationsQuery';
import { useMessagesQuery } from './components/message-management/MessagesQuery';
import MessageHeader from './components/message/MessageHeader';
import ConversationList from './components/message/ConversationList';
import MessageThread from './components/message/MessageThread';


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
