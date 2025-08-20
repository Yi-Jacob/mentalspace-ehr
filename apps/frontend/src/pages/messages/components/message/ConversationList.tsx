
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Badge } from '@/components/basic/badge';
import { MessageSquare, Clock, AlertCircle, Users, User } from 'lucide-react';
import { format } from 'date-fns';

interface ConversationData {
  id: string;
  title: string;
  type: 'individual' | 'group';
  category: string;
  priority: string;
  status?: string;
  lastMessageAt: string;
  client?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  therapist?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  participants?: {
    id: string;
    role: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
    };
  }[];
  messages: Array<{
    id: string;
    content: string;
    createdAt: string;
    sender: {
      firstName: string;
      lastName: string;
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

  const getConversationTitle = (conversation: ConversationData) => {
    if (conversation.type === 'group') {
      return conversation.title;
    }
    
    if (conversation.client) {
      return `${conversation.client.firstName} ${conversation.client.lastName}`;
    }
    
    if (conversation.therapist) {
      return `${conversation.therapist.firstName} ${conversation.therapist.lastName}`;
    }
    
    return conversation.title || 'Unknown Conversation';
  };

  const getConversationSubtitle = (conversation: ConversationData) => {
    if (conversation.type === 'group') {
      const participantCount = conversation.participants?.length || 0;
      return `${participantCount} participant${participantCount !== 1 ? 's' : ''}`;
    }
    
    if (conversation.client) {
      return 'Client Conversation';
    }
    
    if (conversation.therapist) {
      return 'Therapist Conversation';
    }
    
    return 'Conversation';
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm h-full">
        <CardHeader className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-xl">
            <MessageSquare className="h-5 w-5" />
            <span>Conversations</span>
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
            <span>Conversations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 text-gray-500">
            <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
            <p className="text-sm">Start a new conversation to begin messaging</p>
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
          <span>Conversations</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-3">
          {conversations.map((conversation) => {
            const lastMessage = conversation.messages?.[0];
            const isSelected = selectedConversationId === conversation.id;
            
            return (
              <div
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {conversation.type === 'group' ? (
                      <Users className="h-4 w-4 text-purple-600" />
                    ) : (
                      <User className="h-4 w-4 text-blue-600" />
                    )}
                    <h3 className="font-semibold text-gray-900 truncate">
                      {getConversationTitle(conversation)}
                    </h3>
                  </div>
                  <div className="flex space-x-1">
                    <Badge className={getPriorityColor(conversation.priority)}>
                      {conversation.priority}
                    </Badge>
                    <Badge className={getCategoryColor(conversation.category)}>
                      {conversation.category}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">
                  {getConversationSubtitle(conversation)}
                </p>

                {lastMessage && (
                  <div className="text-sm text-gray-500 mb-2">
                    <span className="font-medium">{lastMessage.sender.firstName}:</span>{' '}
                    <span className="truncate">{lastMessage.content}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      {format(new Date(conversation.lastMessageAt), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  {conversation.priority === 'urgent' && (
                    <AlertCircle className="h-3 w-3 text-red-500" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversationList;
