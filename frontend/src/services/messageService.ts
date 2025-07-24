import { apiClient } from './api-helper/client';

// Types for messages and conversations
export interface MessageData {
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

export interface ConversationData {
  id: string;
  title: string;
  category: string;
  priority: string;
  status?: string;
  lastMessageAt: string;
  client: {
    id: string;
    firstName: string;
    lastName: string;
  };
  messages?: MessageData[];
}

export interface CreateConversationData {
  title?: string;
  clientId: string;
  category?: 'clinical' | 'administrative' | 'urgent' | 'general';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}

export interface CreateMessageData {
  conversationId: string;
  content: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  messageType?: string;
}

export interface QuickMessageData {
  clientId: string;
  content: string;
  category?: string;
  priority?: string;
}

// Message Service
export class MessageService {
  private baseUrl = '/messages';

  // Get all conversations for the authenticated therapist
  async getConversations(): Promise<ConversationData[]> {
    return apiClient.get<ConversationData[]>(`${this.baseUrl}/conversations`);
  }

  // Get a specific conversation
  async getConversation(id: string): Promise<ConversationData> {
    return apiClient.get<ConversationData>(`${this.baseUrl}/conversations/${id}`);
  }

  // Create a new conversation
  async createConversation(data: CreateConversationData): Promise<ConversationData> {
    return apiClient.post<ConversationData>(`${this.baseUrl}/conversations`, data);
  }

  // Get messages for a conversation
  async getMessages(conversationId: string): Promise<MessageData[]> {
    return apiClient.get<MessageData[]>(`${this.baseUrl}/conversations/${conversationId}/messages`);
  }

  // Send a message
  async sendMessage(data: CreateMessageData): Promise<MessageData> {
    return apiClient.post<MessageData>(`${this.baseUrl}/messages`, data);
  }

  // Send a quick message (find or create conversation and send message)
  async sendQuickMessage(data: QuickMessageData): Promise<MessageData> {
    return apiClient.post<MessageData>(`${this.baseUrl}/quick-message`, data);
  }
}

export const messageService = new MessageService(); 