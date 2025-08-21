import React from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatMessage as ChatMessageType } from '@/types/aiChatbot';
import { X, Trash2 } from 'lucide-react';
import { Button } from '@/components/basic/button';

interface ChatInterfaceProps {
  messages: ChatMessageType[];
  onSendMessage: (message: string) => void;
  onClose: () => void;
  onClear: () => void;
  onStartNewConversation: () => void;
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  onClose,
  onClear,
  onStartNewConversation,
  isLoading,
  messagesEndRef,
}) => {
  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">AI</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Assistant</h3>
            <p className="text-xs text-gray-500">
              Powered by ChatGPT • {messages.length} messages
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onStartNewConversation}
            className="p-2 hover:bg-gray-200"
            title="Start new conversation"
          >
            <span className="text-xs text-gray-600 font-medium">New Chat</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="p-2 hover:bg-gray-200"
            title="Clear chat"
          >
            <Trash2 className="w-4 h-4 text-gray-500" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2 hover:bg-gray-200"
            title="Close chat"
          >
            <X className="w-4 h-4 text-gray-500" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Start a conversation with your AI assistant</p>
          </div>
        ) : (
          <>
            {/* Context limit warning */}
            {messages.length > 8 && (
              <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-700">
                  💡 Conversation getting long. Consider starting a new chat for better performance.
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </>
        )}
      </div>

      {/* Input */}
      <ChatInput
        onSendMessage={onSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
};
