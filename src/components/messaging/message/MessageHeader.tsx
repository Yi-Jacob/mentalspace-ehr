
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, MessageSquare, Users, Send } from 'lucide-react';

interface MessageHeaderProps {
  onCompose: () => void;
  onNewConversation: () => void;
}

const MessageHeader: React.FC<MessageHeaderProps> = ({
  onCompose,
  onNewConversation,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white shadow-lg">
          <MessageSquare className="h-8 w-8" />
        </div>
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Messages
          </h2>
          <p className="text-gray-600 mt-1">Communicate with your team and clients</p>
        </div>
      </div>
      <div className="flex space-x-3">
        <Button 
          onClick={onCompose}
          className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <Send className="h-4 w-4 mr-2" />
          Quick Message
        </Button>
        <Button 
          onClick={onNewConversation}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Conversation
        </Button>
      </div>
    </div>
  );
};

export default MessageHeader;
