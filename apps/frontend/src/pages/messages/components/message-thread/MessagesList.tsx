
import React from 'react';
import { MessageSquare, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface MessageData {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  priority: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface MessagesListProps {
  messages: MessageData[];
  isLoading: boolean;
}

const MessagesList: React.FC<MessagesListProps> = ({ messages, isLoading }) => {
  const getPriorityIcon = (priority: string) => {
    if (priority === 'urgent' || priority === 'high') {
      return <AlertCircle className="h-3 w-3 text-red-500" />;
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          <div className="text-gray-600 font-medium">Loading messages...</div>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
        <p className="text-sm">Start the conversation by sending a message below</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div key={message.id} className="space-y-2">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-800">
                  {message.sender.firstName} {message.sender.lastName}
                </span>
                {getPriorityIcon(message.priority)}
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{format(new Date(message.createdAt), 'MMM d, h:mm a')}</span>
              </div>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessagesList;
