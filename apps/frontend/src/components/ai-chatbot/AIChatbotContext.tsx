import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { ChatMessage, MessageRole, ChatRequest, ChatResponse } from '@/types/aiChatbot';
import { AIChatbotService } from '@/services/ai-chatbot';
import { useAuth } from '@/hooks/useAuth';

interface AIChatbotContextType {
  isOpen: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  currentSessionId: string | null;
  noteContext: ChatRequest['noteContext'] | null;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  sendMessage: (content: string) => Promise<void>;
  openChat: () => void;
  openChatWithNote: (noteContext: ChatRequest['noteContext']) => void;
  closeChat: () => void;
  clearChat: () => void;
  startNewConversation: () => void;
}

const AIChatbotContext = createContext<AIChatbotContextType | undefined>(undefined);

export const useAIChatbot = () => {
  const context = useContext(AIChatbotContext);
  if (context === undefined) {
    throw new Error('useAIChatbot must be used within an AIChatbotProvider');
  }
  return context;
};

export const AIChatbotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [noteContext, setNoteContext] = useState<ChatRequest['noteContext'] | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const addMessage = useCallback((content: string, role: MessageRole) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      role,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMessage]);
    setTimeout(scrollToBottom, 100);
  }, [scrollToBottom]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !user) return;

    try {
      setIsLoading(true);
      setError(null);

      // Add user message immediately
      addMessage(content, MessageRole.USER);

      let response: ChatResponse;

      if (noteContext) {
        // Use note context for the first message
        response = await AIChatbotService.sendMessageWithNoteContext(content, noteContext);
        // Clear note context after first use to avoid sending it repeatedly
        setNoteContext(null);
      } else {
        // Regular chat without note context
        const request: ChatRequest = {
          message: content,
          sessionId: currentSessionId || undefined,
        };
        response = await AIChatbotService.sendMessage(request);
      }

      // Update session ID if this is a new session
      if (!currentSessionId) {
        setCurrentSessionId(response.sessionId);
      }

      // Add AI response
      addMessage(response.message, MessageRole.ASSISTANT);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      addMessage('Sorry, I encountered an error. Please try again.', MessageRole.ASSISTANT);
    } finally {
      setIsLoading(false);
    }
  }, [user, currentSessionId, noteContext, addMessage]);

  const openChat = useCallback(() => {
    setIsOpen(true);
    if (messages.length === 0) {
      addMessage('Hello! I\'m your AI assistant. How can I help you today?', MessageRole.ASSISTANT);
    }
  }, [messages.length, addMessage]);

  const openChatWithNote = useCallback((noteContext: ChatRequest['noteContext']) => {
    console.log('openChatWithNote called with:', noteContext);
    setNoteContext(noteContext);
    setIsOpen(true);
    console.log('Setting isOpen to true');
    
    // Add welcome message with note context after a short delay to ensure state is set
    setTimeout(() => {
      const welcomeMessage = `Hello! I'm your AI assistant. I can see you're working with a ${noteContext?.noteType.replace('_', ' ')} note for ${noteContext?.clientName}. How can I help you with this note?`;
      addMessage(welcomeMessage, MessageRole.ASSISTANT);
    }, 100);
  }, [addMessage]);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setCurrentSessionId(null);
    setError(null);
    setNoteContext(null);
  }, []);

  const startNewConversation = useCallback(() => {
    setMessages([]);
    setCurrentSessionId(null);
    setError(null);
    setNoteContext(null);
    // Add welcome message for new conversation
    addMessage('Hello! I\'m your AI assistant. How can I help you today?', MessageRole.ASSISTANT);
  }, [addMessage]);

  const value: AIChatbotContextType = {
    isOpen,
    messages,
    isLoading,
    error,
    currentSessionId,
    noteContext,
    messagesEndRef,
    sendMessage,
    openChat,
    openChatWithNote,
    closeChat,
    clearChat,
    startNewConversation,
  };

  return (
    <AIChatbotContext.Provider value={value}>
      {children}
    </AIChatbotContext.Provider>
  );
};
