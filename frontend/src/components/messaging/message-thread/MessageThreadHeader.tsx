
import React from 'react';
import { CardHeader, CardTitle } from '@/components/shared/ui/card';
import { MessageSquare } from 'lucide-react';

interface ConversationData {
  id: string;
  title: string;
  category: string;
  priority: string;
  client: {
    first_name: string;
    last_name: string;
  };
}

interface MessageThreadHeaderProps {
  selectedConversation: ConversationData | undefined;
}

const MessageThreadHeader: React.FC<MessageThreadHeaderProps> = ({
  selectedConversation,
}) => {
  return (
    <CardHeader className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white rounded-t-lg">
      <CardTitle className="flex items-center space-x-2 text-xl">
        <MessageSquare className="h-5 w-5" />
        <span>{selectedConversation?.title || 'Conversation'}</span>
      </CardTitle>
      {selectedConversation && (
        <div className="flex items-center justify-between text-purple-100 text-sm">
          <span>Client: {selectedConversation.client.first_name} {selectedConversation.client.last_name}</span>
          <div className="flex items-center space-x-2">
            <span className="capitalize">{selectedConversation.category}</span>
            <span>•</span>
            <span className="capitalize">{selectedConversation.priority}</span>
          </div>
        </div>
      )}
    </CardHeader>
  );
};

export default MessageThreadHeader;
