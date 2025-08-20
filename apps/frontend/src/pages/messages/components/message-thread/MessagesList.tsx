
import React, { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { Clock, Reply, CheckCheck, AlertTriangle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/basic/button';
import { MessageData } from '@/services/messageService';
import { useAuth } from '../../../../hooks/useAuth';

interface MessagesListProps {
  messages: MessageData[];
  isLoading: boolean;
  onReply?: (messageId: string) => void;
  replyToId?: string | null;
  conversationId?: string;
}

// MessageItem component for individual messages
const MessageItem: React.FC<{
  message: MessageData;
  isOwnMessage: boolean;
  onReply?: (messageId: string) => void;
}> = ({ message, isOwnMessage, onReply }) => {
  const getPriorityIcon = (priority: string) => {
    if (priority === 'urgent' || priority === 'high') {
      return <AlertTriangle className="h-3 w-3 text-red-500" />;
    }
    return null;
  };

  // Calculate message width based on content length
  const contentLength = message.content.length;
  let messageWidth;
  
  if (contentLength <= 30) {
    messageWidth = 'max-w-[40%]';
  } else if (contentLength <= 80) {
    messageWidth = 'max-w-[70%]';
  } else if (contentLength <= 150) {
    messageWidth = 'max-w-[85%]';
  } else {
    messageWidth = 'max-w-[95%]';
  }

  return (
    <div className="space-y-1">
      <div className={`rounded-lg p-3 shadow-sm border transition-all duration-200 hover:shadow-md ${messageWidth} ${
        isOwnMessage 
          ? 'bg-blue-100 text-gray-800 border-blue-300 ml-auto' 
          : 'bg-gray-100 text-gray-700 border-gray-300 mr-auto'
      }`}>
        {/* Reply to message */}
        {message.replyTo && (
          <div className={`mb-2 p-2 rounded border-l-4 ${
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

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {/* Only show sender name for others' messages */}
            {!isOwnMessage && (
              <span className="font-semibold text-gray-800 text-sm">
                {message.sender.firstName} {message.sender.lastName}
              </span>
            )}
            {getPriorityIcon(message.priority)}
            {message.priority !== 'normal' && (
              <span className={`text-xs px-2 py-1 rounded-full ${
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
        
        <p className={`whitespace-pre-wrap mb-2 ${
          isOwnMessage ? 'text-gray-800' : 'text-gray-700'
        }`}>
          {message.content}
        </p>

        {/* Read receipts */}
        {message.readReceipts.length > 0 && (
          <div className={`flex items-center space-x-2 text-xs border-t pt-2 ${
            isOwnMessage 
              ? 'border-blue-300 text-blue-700' 
              : 'border-gray-300 text-gray-600'
          }`}>
            <CheckCheck className="h-3 w-3" />
            <span>
              Read by {message.readReceipts.length} {message.readReceipts.length === 1 ? 'person' : 'people'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const MessagesList: React.FC<MessagesListProps> = ({
  messages,
  isLoading,
  onReply,
  replyToId,
  conversationId,
}) => {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No messages yet</p>
            <p className="text-sm">Start the conversation by sending a message</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              isOwnMessage={message.senderId === user?.id}
              onReply={onReply}
            />
          ))}
          {/* Invisible element for auto-scrolling */}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default MessagesList;
