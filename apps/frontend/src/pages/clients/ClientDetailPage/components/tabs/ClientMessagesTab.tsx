
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Button } from '@/components/basic/button';
import { Badge } from '@/components/basic/badge';
import { MessageSquare, Plus, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { messageService } from '@/services/messageService';
import UnifiedConversationModal from '@/pages/messages/components/UnifiedConversationModal';

interface ClientMessagesTabProps {
  clientId: string;
}

interface Conversation {
  id: string;
  title: string;
  category: string;
  priority: string;
  status: string;
  last_message_at: string;
  created_at: string;
  messages: Array<{
    id: string;
    content: string;
    created_at: string;
    sender: {
      id: string;
      first_name: string;
      last_name: string;
    };
  }>;
}

const ClientMessagesTab: React.FC<ClientMessagesTabProps> = ({ clientId }) => {
  const [showUnifiedModal, setShowUnifiedModal] = useState(false);

  const { data: conversations, isLoading, error } = useQuery({
    queryKey: ['client-conversations', clientId],
    queryFn: async () => {
      // This would need to be implemented in the backend to get conversations for a specific client
      // For now, we'll return an empty array
      return [] as Conversation[];
    },
    enabled: !!clientId,
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'clinical': return 'bg-blue-100 text-blue-800';
      case 'administrative': return 'bg-green-100 text-green-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'general': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-500">Loading conversations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading conversations: {error.message}</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Messages & Conversations</h3>
          <Button
            size="sm"
            onClick={() => setShowUnifiedModal(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>New +</span>
          </Button>
        </div>

        {conversations && conversations.length > 0 ? (
          <div className="space-y-4">
            {conversations.map((conversation) => (
              <Card key={conversation.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base">
                        {conversation.title || 'Untitled Conversation'}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge className={getCategoryColor(conversation.category)}>
                          {conversation.category}
                        </Badge>
                        <Badge className={getPriorityColor(conversation.priority)}>
                          {conversation.priority} priority
                        </Badge>
                        <Badge variant="outline">
                          {conversation.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {conversation.last_message_at 
                          ? format(new Date(conversation.last_message_at), 'MMM d, yyyy HH:mm')
                          : format(new Date(conversation.created_at), 'MMM d, yyyy HH:mm')
                        }
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {conversation.messages && conversation.messages.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        {conversation.messages.length} message{conversation.messages.length !== 1 ? 's' : ''}
                      </p>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                          <User className="h-3 w-3" />
                          <span>
                            {conversation.messages[0]?.sender?.first_name} {conversation.messages[0]?.sender?.last_name}
                          </span>
                          <span>•</span>
                          <span>
                            {format(new Date(conversation.messages[0]?.created_at), 'MMM d, HH:mm')}
                          </span>
                        </div>
                        <p className="text-sm line-clamp-2">
                          {conversation.messages[0]?.content}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No messages yet</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-8">
            <CardContent>
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h4>
              <p className="text-gray-500 mb-4">
                Start a conversation with this client to keep track of your communications.
              </p>
              <Button onClick={() => setShowUnifiedModal(true)}>
                Start New Conversation
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Unified Conversation Modal */}
      <UnifiedConversationModal
        open={showUnifiedModal}
        onOpenChange={setShowUnifiedModal}
        preselectedClientId={clientId}
      />
    </>
  );
};

export default ClientMessagesTab;
