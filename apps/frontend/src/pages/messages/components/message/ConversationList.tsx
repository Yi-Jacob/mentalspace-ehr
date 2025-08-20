
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
        <h2 className="text-lg font-semibold">Conversations</h2>
      </div>
      
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="p-4">
            <div className="animate-pulse space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No conversations yet</p>
            <p className="text-sm">Start a new conversation to get started</p>
          </div>
        ) : (
          <div className="overflow-y-auto h-full">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedConversationId === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-gray-900 truncate">
                        {getConversationTitle(conversation)}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        conversation.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        conversation.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        conversation.priority === 'normal' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {conversation.priority}
                      </span>
                    </div>
                    
                    {conversation.messages && conversation.messages.length > 0 && (
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.messages[0].content}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {conversation.lastMessageAt ? format(new Date(conversation.lastMessageAt), 'MMM d, h:mm a') : 'No messages'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Edit button positioned at the end of the vertical line */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditConversation(conversation);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors ml-2 flex-shrink-0"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
