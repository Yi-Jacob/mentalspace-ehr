
import React from 'react';
import { MessageSquare, Clock, AlertCircle, Reply, CheckCheck } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/basic/button';

interface MessageData {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  priority: string;
  replyToId?: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
  };
  replyTo?: {
    id: string;
    content: string;
    sender: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
  readReceipts: {
    id: string;
    readAt: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
    };
  }[];
}

interface MessagesListProps {
  messages: MessageData[];
  isLoading: boolean;
  onReply?: (messageId: string) => void;
  replyToId?: string | null;
}

const MessagesList: React.FC<MessagesListProps> = ({ 
  messages, 
  isLoading, 
  onReply,
  replyToId 
}) => {
  const getPriorityIcon = (priority: string) => {
    if (priority === 'urgent' || priority === 'high') {
      return <AlertCircle className="h-3 w-3 text-red-500" />;
    }
    return null;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-red-300 bg-red-50';
      case 'high': return 'border-orange-300 bg-orange-50';
      case 'normal': return 'border-blue-300 bg-blue-50';
      case 'low': return 'border-gray-300 bg-gray-50';
      default: return 'border-blue-300 bg-blue-50';
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
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
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div key={message.id} className="space-y-2">
          <div className={`bg-white rounded-xl p-4 shadow-sm border-2 transition-all duration-200 hover:shadow-md ${getPriorityColor(message.priority)}`}>
            {/* Reply to message */}
            {message.replyTo && (
              <div className="mb-3 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-400">
                <div className="text-xs text-gray-500 mb-1">
                  Replying to {message.replyTo.sender.firstName} {message.replyTo.sender.lastName}
                </div>
                <div className="text-sm text-gray-700 truncate">
                  {message.replyTo.content}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-800">
                  {message.sender.firstName} {message.sender.lastName}
                </span>
                {getPriorityIcon(message.priority)}
                {message.priority !== 'normal' && (
                  <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(message.priority)}`}>
                    {message.priority}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{format(new Date(message.createdAt), 'MMM d, h:mm a')}</span>
                </div>
                {onReply && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onReply(message.id)}
                    className="h-6 w-6 p-0 hover:bg-gray-100"
                  >
                    <Reply className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            
            <p className="text-gray-700 whitespace-pre-wrap mb-3">{message.content}</p>

            {/* Read receipts */}
            {message.readReceipts.length > 0 && (
              <div className="flex items-center space-x-2 text-xs text-gray-500 border-t pt-2">
                <CheckCheck className="h-3 w-3 text-green-500" />
                <span>
                  Read by {message.readReceipts.map(r => r.user.firstName).join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessagesList;
