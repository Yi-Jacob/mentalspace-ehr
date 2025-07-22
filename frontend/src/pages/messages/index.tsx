import { MessageSquare, Send, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/ui/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import ComposeMessageModal from './components/ComposeMessageModal';
import NewConversationModal from './components/NewConversationModal';
import { useMessageManagementState } from './components/message-management/MessageManagementState';
import { useConversationsQuery } from './components/message-management/ConversationsQuery';
import { useMessagesQuery } from './components/message-management/MessagesQuery';
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
      <PageLayout variant="gradient">
        <PageHeader
          icon={MessageSquare}
          title="Client Messages"
          description="Secure communication with your clients"
  
                  action={
          <div className="flex space-x-3">
            <Button 
              onClick={() => setShowComposeModal(true)}
              className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Send className="h-4 w-4 mr-2" />
              Quick Message
            </Button>
            <Button 
              onClick={() => setShowNewConversationModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Conversation
            </Button>
          </div>
        }
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
      </PageLayout>

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
