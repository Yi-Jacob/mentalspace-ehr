
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface ConversationData {
  id: string;
  title: string;
  category: string;
  priority: string;
  status: string;
  last_message_at: string;
  client: {
    id: string;
    first_name: string;
    last_name: string;
  };
  messages: Array<{
    id: string;
    content: string;
    created_at: string;
    sender: {
      first_name: string;
      last_name: string;
    };
  }>;
}

interface ConversationListProps {
  conversations: ConversationData[];
  isLoading: boolean;
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  isLoading,
  selectedConversationId,
  onSelectConversation,
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'urgent': return 'bg-red-50 text-red-700';
      case 'clinical': return 'bg-green-50 text-green-700';
      case 'administrative': return 'bg-purple-50 text-purple-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm h-full">
        <CardHeader className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-xl">
            <MessageSquare className="h-5 w-5" />
            <span>Client Conversations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              <div className="text-gray-600 font-medium">Loading conversations...</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (conversations.length === 0) {
    return (
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm h-full">
        <CardHeader className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-xl">
            <MessageSquare className="h-5 w-5" />
            <span>Client Conversations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 text-gray-500">
            <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
            <p className="text-sm">Start a new conversation with a client to begin messaging</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm h-full">
      <CardHeader className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center space-x-2 text-xl">
          <MessageSquare className="h-5 w-5" />
          <span>Client Conversations</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-y-auto h-full">
        <div className="space-y-2 p-4">
          {conversations.map((conversation) => {
            const lastMessage = conversation.messages?.[conversation.messages.length - 1];
            const clientName = `${conversation.client.first_name} ${conversation.client.last_name}`;

            return (
              <div
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedConversationId === conversation.id
                    ? 'bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-300 transform scale-102'
                    : 'bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-800 truncate flex-1">
                    {conversation.title || `Conversation with ${clientName}`}
                  </h4>
                  <div className="flex items-center space-x-1 ml-2">
                    {conversation.priority === 'urgent' && (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <Badge variant="outline" className="text-xs">
                      {conversation.messages?.length || 0}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mb-2">
                  <Badge className={`text-xs ${getCategoryColor(conversation.category)}`}>
                    {conversation.category}
                  </Badge>
                  <Badge className={`text-xs ${getPriorityColor(conversation.priority)}`}>
                    {conversation.priority}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-1 font-medium">
                  Client: {clientName}
                </p>
                
                {lastMessage && (
                  <div className="text-xs text-gray-500 space-y-1">
                    <p className="truncate">
                      {lastMessage.sender.first_name}: {lastMessage.content}
                    </p>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{format(new Date(lastMessage.created_at), 'MMM d, h:mm a')}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversationList;
