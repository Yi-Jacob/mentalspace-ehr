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
    const response = await apiClient.get<ConversationData[]>(`${this.baseUrl}/conversations`);
    return response.data;
  }

  // Get a specific conversation
  async getConversation(id: string): Promise<ConversationData> {
    const response = await apiClient.get<ConversationData>(`${this.baseUrl}/conversations/${id}`);
    return response.data;
  }

  // Create a new conversation
  async createConversation(data: CreateConversationData): Promise<ConversationData> {
    const response = await apiClient.post<ConversationData>(`${this.baseUrl}/conversations`, data);
    return response.data;
  }

  // Get messages for a conversation
  async getMessages(conversationId: string): Promise<MessageData[]> {
    const response = await apiClient.get<MessageData[]>(`${this.baseUrl}/conversations/${conversationId}/messages`);
    return response.data;
  }

  // Send a message
  async sendMessage(data: CreateMessageData): Promise<MessageData> {
    const response = await apiClient.post<MessageData>(`${this.baseUrl}/messages`, data);
    return response.data;
  }

  // Send a quick message (find or create conversation and send message)
  async sendQuickMessage(data: QuickMessageData): Promise<MessageData> {
    const response = await apiClient.post<MessageData>(`${this.baseUrl}/quick-message`, data);
    return response.data;
  }
}

export const messageService = new MessageService(); 