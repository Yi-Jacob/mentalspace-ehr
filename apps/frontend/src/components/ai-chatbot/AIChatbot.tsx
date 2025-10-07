import React from 'react';
import { Bot } from 'lucide-react';
import { useAIChatbot } from './AIChatbotContext';
import { ChatInterface } from './ChatInterface';

export const AIChatbot: React.FC = () => {
  const {
    isOpen,
    messages,
    isLoading,
    error,
    noteContext,
    messagesEndRef,
    sendMessage,
    openChat,
    closeChat,
    clearChat,
    startNewConversation,
  } = useAIChatbot();
  
  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={openChat}
          className="fixed bottom-4 right-4 w-14 h-14 bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-40 group"
          title="Chat with AI Assistant"
        >
          <Bot className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-200" />
        </button>
      )}

      {/* Chat Interface */}
      {isOpen && (
        <ChatInterface
          messages={messages}
          onSendMessage={sendMessage}
          onClose={closeChat}
          onClear={clearChat}
          onStartNewConversation={startNewConversation}
          isLoading={isLoading}
          messagesEndRef={messagesEndRef}
          noteContext={noteContext}
        />
      )}

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-20 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <p className="text-sm">{error}</p>
        </div>
      )}
    </>
  );
};
