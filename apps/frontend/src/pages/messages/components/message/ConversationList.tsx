
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Badge } from '@/components/basic/badge';
import { MessageSquare, Clock, AlertCircle, Users, User } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';

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
  const { user: currentUser } = useAuth();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getConversationTitle = (conversation: ConversationData) => {
    if (conversation.type === 'group') {
      return conversation.title;
    }
    
    // For individual conversations, determine whose name to show
    if (conversation.type === 'individual') {
      if (conversation.client) {
        return `${conversation.therapist.firstName} ${conversation.therapist.lastName}`;
      }
      
      if (conversation.therapist) {
        return `${conversation.client.firstName} ${conversation.client.lastName}`;
      }
    }
    
    return conversation.title || 'Unknown Conversation';
  };

  const getConversationSubtitle = (conversation: ConversationData) => {
    if (conversation.type === 'group') {
      return 'Group Conversation';
    }
    
    if (conversation.client) {
      return 'Client';
    }
    
    if (conversation.therapist) {
      return 'Staff';
    }
    
    return 'Conversation';
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg bg-white h-full">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <MessageSquare className="h-4 w-4" />
            <span>Conversations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-center py-6">
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              <div className="text-gray-600 text-sm">Loading...</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (conversations.length === 0) {
    return (
      <Card className="border-0 shadow-lg bg-white h-full">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <MessageSquare className="h-4 w-4" />
            <span>Conversations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <h3 className="text-base font-semibold mb-1">No conversations</h3>
            <p className="text-xs">Start a new conversation</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-white h-full">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <MessageSquare className="h-4 w-4" />
          <span>Conversations</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="space-y-2">
          {conversations.map((conversation) => {
            const lastMessage = conversation.messages?.[0];
            const isSelected = selectedConversationId === conversation.id;
            
            return (
              <div
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    {conversation.type === 'group' ? (
                      <Users className="h-3 w-3 text-purple-600 flex-shrink-0" />
                    ) : (
                      <User className="h-3 w-3 text-blue-600 flex-shrink-0" />
                    )}
                    <h3 className="font-medium text-gray-900 truncate text-sm">
                      {getConversationTitle(conversation)}
                    </h3>
                  </div>
                  <div className="flex space-x-1 flex-shrink-0">
                    <Badge className={`text-xs px-2 py-1 ${getPriorityColor(conversation.priority)}`}>
                      {conversation.priority}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-xs text-gray-600 mb-2">
                  {getConversationSubtitle(conversation)}
                </p>

                {lastMessage && (
                  <div className="text-xs text-gray-500 mb-2">
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
