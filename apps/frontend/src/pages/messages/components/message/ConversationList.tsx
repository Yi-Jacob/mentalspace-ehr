
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Badge } from '@/components/basic/badge';
import { MessageSquare, Clock, AlertCircle, Users, User, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { ConversationData } from '@/services/messageService';

interface ConversationListProps {
  conversations: ConversationData[];
  isLoading: boolean;
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onEditConversation?: (conversation: ConversationData) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  isLoading,
  selectedConversationId,
  onSelectConversation,
  onEditConversation,
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
      if (conversation.client && conversation.therapist) {
        // If current user is the client, show therapist name
        if (currentUser?.id === conversation.client.id) {
          return `${conversation.therapist.firstName} ${conversation.therapist.lastName}`;
        }
        // If current user is the therapist, show client name
        if (currentUser?.id === conversation.therapist.id) {
          return `${conversation.client.firstName} ${conversation.client.lastName}`;
        }
        // Fallback: show client name if current user is neither
        return `${conversation.client.firstName} ${conversation.client.lastName}`;
      }
      
      // Fallback cases
      if (conversation.client) {
        return `${conversation.client.firstName} ${conversation.client.lastName}`;
      }
      
      if (conversation.therapist) {
        return `${conversation.therapist.firstName} ${conversation.therapist.lastName}`;
      }
    }
    
    return conversation.title || 'Unknown Conversation';
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
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Badge className={`text-xs px-2 py-1 ${getPriorityColor(conversation.priority)}`}>
                      {conversation.priority}
                    </Badge>
                    {onEditConversation && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditConversation(conversation);
                        }}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                        title="Edit conversation"
                      >
                        <MoreVertical className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                      </button>
                    )}
                  </div>
                </div>

                {lastMessage && (
                  <div className="text-xs text-gray-500 mb-2">
                    
                    <span className="truncate block overflow-hidden text-ellipsis whitespace-nowrap"><span className="font-medium">{lastMessage.sender.firstName}:</span>{' '}{lastMessage.content}</span>
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
