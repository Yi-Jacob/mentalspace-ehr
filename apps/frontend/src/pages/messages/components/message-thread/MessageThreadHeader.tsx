
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

  const getConversationIcon = () => {
    if (!conversation) return <MessageSquare className="h-5 w-5" />;
    
    if (conversation.type === 'group') {
      return <Users className="h-5 w-5" />;
    }
    
    return <User className="h-5 w-5" />;
  };

  return (
    <CardHeader className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-t-lg">
      <CardTitle className="flex items-center space-x-2 text-xl">
        {getConversationIcon()}
        <span>{getConversationTitle()}</span>
      </CardTitle>
      {conversation && !isLoading && (
        <div className="flex items-center justify-between text-blue-100 text-sm">
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
