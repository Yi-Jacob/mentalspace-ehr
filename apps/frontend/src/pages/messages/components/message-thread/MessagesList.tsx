
import React from 'react';
import { MessageSquare, Clock, AlertCircle, Reply, CheckCheck } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/basic/button';
import { useAuth } from '@/hooks/useAuth';

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
  const { user } = useAuth();
  const currentUserId = user?.id;

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
      <div className="text-center py-6">
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <div className="text-gray-600 text-sm">Loading messages...</div>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
        <h3 className="text-base font-semibold mb-1">No messages yet</h3>
        <p className="text-xs">Start the conversation by sending a message below</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-2">
      {messages.map((message) => {
        const isOwnMessage = message.senderId === currentUserId;
        
        return (
          <div key={message.id} className="space-y-1">
            <div className={`rounded-lg p-2 shadow-sm border transition-all duration-200 hover:shadow-md ${
              isOwnMessage 
                ? 'bg-blue-100 text-gray-800 border-blue-300 ml-6' 
                : 'bg-gray-100 text-gray-700 border-gray-300 mr-6'
            }`}>
              {/* Reply to message */}
              {message.replyTo && (
                <div className={`mb-1 p-1 rounded border-l-4 ${
                  isOwnMessage 
                    ? 'bg-blue-200/50 border-blue-400' 
                    : 'bg-gray-200/50 border-blue-400'
                }`}>
                  <div className={`text-xs mb-1 ${
                    isOwnMessage ? 'text-blue-700' : 'text-gray-600'
                  }`}>
                    Replying to {message.replyTo.sender.firstName} {message.replyTo.sender.lastName}
                  </div>
                  <div className={`text-sm truncate ${
                    isOwnMessage ? 'text-blue-800' : 'text-gray-700'
                  }`}>
                    {message.replyTo.content}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  {/* Only show sender name for others' messages */}
                  {!isOwnMessage && (
                    <span className="font-semibold text-gray-800 text-sm">
                      {message.sender.firstName} {message.sender.lastName}
                    </span>
                  )}
                  {getPriorityIcon(message.priority)}
                  {message.priority !== 'normal' && (
                    <span className={`text-xs px-1 py-0.5 rounded-full ${
                      isOwnMessage 
                        ? 'bg-blue-200 text-blue-800' 
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {message.priority}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`flex items-center space-x-1 text-xs ${
                    isOwnMessage ? 'text-blue-700' : 'text-gray-600'
                  }`}>
                    <Clock className="h-3 w-3" />
                    <span>{format(new Date(message.createdAt), 'h:mm a')}</span>
                  </div>
                  {onReply && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onReply(message.id)}
                      className={`h-6 w-6 p-0 ${
                        isOwnMessage 
                          ? 'hover:bg-blue-200 text-blue-700' 
                          : 'hover:bg-gray-200 text-gray-600'
                      }`}
                    >
                      <Reply className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
              
              <p className={`whitespace-pre-wrap mb-1 ${
                isOwnMessage ? 'text-gray-800' : 'text-gray-700'
              }`}>
                {message.content}
              </p>

              {/* Read receipts */}
              {message.readReceipts.length > 0 && (
                <div className={`flex items-center space-x-2 text-xs border-t pt-1 ${
                  isOwnMessage 
                    ? 'border-blue-300 text-blue-700' 
                    : 'border-gray-300 text-gray-600'
                }`}>
                  <CheckCheck className={`h-3 w-3 ${
                    isOwnMessage ? 'text-blue-600' : 'text-green-500'
                  }`} />
                  <span>
                    Read by {message.readReceipts.map(r => r.user.firstName).join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessagesList;
