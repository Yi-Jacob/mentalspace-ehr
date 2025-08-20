
import React from 'react';
import { CardHeader, CardTitle } from '@/components/basic/card';
import { MessageSquare, Users, User } from 'lucide-react';

interface ConversationData {
  id: string;
  title: string;
  type: 'individual' | 'group';
  category: string;
  priority: string;
  client?: {
    firstName: string;
    lastName: string;
  };
  therapist?: {
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
}

interface MessageThreadHeaderProps {
  conversation: ConversationData | undefined;
  isLoading?: boolean;
}

const MessageThreadHeader: React.FC<MessageThreadHeaderProps> = ({
  conversation,
  isLoading = false,
}) => {
  const getConversationTitle = () => {
    if (!conversation) return 'Conversation';
    
    if (conversation.type === 'group') {
      return conversation.title;
    }
    
    if (conversation.client) {
      return `${conversation.client.firstName} ${conversation.client.lastName}`;
    }
    
    if (conversation.therapist) {
      return `${conversation.therapist.firstName} ${conversation.therapist.lastName}`;
    }
    
    return conversation.title || 'Conversation';
  };

  const getConversationSubtitle = () => {
    if (!conversation) return '';
    
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

  const getConversationIcon = () => {
    if (!conversation) return <MessageSquare className="h-4 w-4" />;
    
    if (conversation.type === 'group') {
      return <Users className="h-4 w-4" />;
    }
    
    return <User className="h-4 w-4" />;
  };

  return (
    <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg pb-3">
      <CardTitle className="flex items-center space-x-2 text-lg">
        {getConversationIcon()}
        <span>{getConversationTitle()}</span>
      </CardTitle>
      {conversation && !isLoading && (
        <div className="flex items-center justify-between text-blue-100 text-xs">
          <span>{getConversationSubtitle()}</span>
          <div className="flex items-center space-x-2">
            <span className="capitalize">{conversation.category}</span>
            <span>•</span>
            <span className="capitalize">{conversation.priority}</span>
          </div>
        </div>
      )}
    </CardHeader>
  );
};

export default MessageThreadHeader;
