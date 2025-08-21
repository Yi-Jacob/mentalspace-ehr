import { useState, useCallback, useRef } from 'react';
import { ChatMessage, MessageRole, ChatRequest, ChatResponse } from '@/types/aiChatbot';
import { AIChatbotService } from '@/services/ai-chatbot';
import { useAuth } from './useAuth';

export const useAIChatbot = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
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

      const request: ChatRequest = {
        message: content,
        sessionId: currentSessionId || undefined,
      };

      const response: ChatResponse = await AIChatbotService.sendMessage(request);

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
  }, [user, currentSessionId, addMessage]);

  const openChat = useCallback(() => {
    setIsOpen(true);
    if (messages.length === 0) {
      addMessage('Hello! I\'m your AI assistant. How can I help you today?', MessageRole.ASSISTANT);
    }
  }, [messages.length, addMessage]);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setCurrentSessionId(null);
    setError(null);
  }, []);

  const startNewConversation = useCallback(() => {
    setMessages([]);
    setCurrentSessionId(null);
    setError(null);
    // Add welcome message for new conversation
    addMessage('Hello! I\'m your AI assistant. How can I help you today?', MessageRole.ASSISTANT);
  }, [addMessage]);

  return {
    isOpen,
    messages,
    isLoading,
    error,
    currentSessionId,
    messagesEndRef,
    sendMessage,
    openChat,
    closeChat,
    clearChat,
    startNewConversation,
  };
};
