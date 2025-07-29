
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api-helper/client';
import { MessageSquare, Plus, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import ComposeMessageModal from '@/pages/messages/components/ComposeMessageModal';
import NewConversationModal from '@/pages/messages/components/NewConversationModal';
import { useAuth } from '@/hooks/useAuth';

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  sender: {
    first_name: string;
    last_name: string;
  };
}

interface Conversation {
  id: string;
  title: string;
  category: string;
  priority: string;
  status: string;
  last_message_at: string;
  created_at: string;
  messages: Message[];
}

interface ClientMessagesTabProps {
  clientId: string;
}

const ClientMessagesTab: React.FC<ClientMessagesTabProps> = ({ clientId }) => {
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showNewConversationModal, setShowNewConversationModal] = useState(false);
  const { user } = useAuth();

  const { data: conversations, isLoading } = useQuery({
    queryKey: ['client-conversations', clientId],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const response = await apiClient.get<Conversation[]>(`/conversations?clientId=${clientId}&therapistId=${user.id}`);
      return response.data || [];
    },
    enabled: !!user,
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'clinical': return 'bg-green-100 text-green-800';
      case 'administrative': return 'bg-purple-100 text-purple-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'general': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Messages & Conversations</h3>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Loading conversations...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Messages & Conversations</h3>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowComposeModal(true)}
              className="flex items-center space-x-2"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Quick Message</span>
            </Button>
            <Button
              size="sm"
              onClick={() => setShowNewConversationModal(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>New Conversation</span>
            </Button>
          </div>
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
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowComposeModal(true)}
                >
                  Send Quick Message
                </Button>
                <Button onClick={() => setShowNewConversationModal(true)}>
                  Start New Conversation
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <ComposeMessageModal 
        open={showComposeModal} 
        onOpenChange={setShowComposeModal}
        preselectedClientId={clientId}
      />
      
      <NewConversationModal 
        open={showNewConversationModal} 
        onOpenChange={setShowNewConversationModal}
        preselectedClientId={clientId}
      />
    </>
  );
};

export default ClientMessagesTab;
