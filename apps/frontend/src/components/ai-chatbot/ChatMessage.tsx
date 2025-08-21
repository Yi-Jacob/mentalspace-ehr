import React from 'react';
import { ChatMessage as ChatMessageType, MessageRole } from '@/types/aiChatbot';
import { Bot, User } from 'lucide-react';
// Simple utility function for conditional classes
const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === MessageRole.USER;
  const isAssistant = message.role === MessageRole.ASSISTANT;

  return (
    <div className={cn(
      'flex gap-3 p-4',
      isUser ? 'justify-end' : 'justify-start'
    )}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className={cn(
        'max-w-[80%] rounded-lg px-4 py-2',
        isUser 
          ? 'bg-blue-500 text-white' 
          : 'bg-gray-100 text-gray-900'
      )}>
        <p className="text-sm whitespace-pre-wrap break-words">
          {message.content}
        </p>
        <p className={cn(
          'text-xs mt-2',
          isUser ? 'text-blue-100' : 'text-gray-500'
        )}>
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
};
