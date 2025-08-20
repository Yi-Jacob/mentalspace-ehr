import { apiClient } from './api-helper/client';

// Types for messages and conversations
export interface MessageData {
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

export interface ConversationData {
  id: string;
  title: string;
  type: 'individual' | 'group';
  category: string;
  priority: string;
  status?: string;
  lastMessageAt: string;
  client?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  therapist?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  participants?: {
    id: string;
    role: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
    };
  }[];
  messages?: MessageData[];
}

export interface CreateConversationData {
  title?: string;
  clientId: string;
  category?: 'clinical' | 'administrative' | 'urgent' | 'general';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}

export interface CreateGroupConversationData {
  title: string;
  participantIds: string[];
  category?: 'clinical' | 'administrative' | 'urgent' | 'general' | 'group';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}

export interface CreateMessageData {
  conversationId: string;
  content: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  messageType?: string;
  replyToId?: string;
}

export interface CreateConversationWithMessageData {
  title: string;
  participantIds: string[];
  category?: 'clinical' | 'administrative' | 'urgent' | 'general' | 'group';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  initialMessage: string;
  type: 'individual' | 'group';
}

export interface QuickMessageData {
  recipientId: string;
  content: string;
  category?: string;
  priority?: string;
}

export interface MarkMessageReadData {
  messageId: string;
}

// Message Service
export class MessageService {
  private baseUrl = '/messages';

  // Get all conversations for the authenticated user
  async getConversations(): Promise<ConversationData[]> {
    const response = await apiClient.get<ConversationData[]>(`${this.baseUrl}/conversations`);
    return response.data;
  }

  // Get a specific conversation
  async getConversation(id: string): Promise<ConversationData> {
    const response = await apiClient.get<ConversationData>(`${this.baseUrl}/conversations/${id}`);
    return response.data;
  }

  // Create a new individual conversation
  async createConversation(data: CreateConversationData): Promise<ConversationData> {
    const response = await apiClient.post<ConversationData>(`${this.baseUrl}/conversations`, data);
    return response.data;
  }

  // Create a new group conversation
  async createGroupConversation(data: CreateGroupConversationData): Promise<ConversationData> {
    const response = await apiClient.post<ConversationData>(`${this.baseUrl}/conversations/group`, data);
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

  // Mark message as read
  async markMessageAsRead(data: MarkMessageReadData): Promise<any> {
    const response = await apiClient.post(`${this.baseUrl}/messages/read`, data);
    return response.data;
  }

  // Get unread message count
  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get<number>(`${this.baseUrl}/unread-count`);
    return response.data;
  }

  // Send a quick message (find or create conversation and send message)
  async sendQuickMessage(data: QuickMessageData): Promise<MessageData> {
    const response = await apiClient.post<MessageData>(`${this.baseUrl}/quick-message`, data);
    return response.data;
  }

  // Create conversation with initial message
  async createConversationWithMessage(data: CreateConversationWithMessageData): Promise<{
    conversation: ConversationData;
    message: MessageData;
  }> {
    const response = await apiClient.post<{
      conversation: ConversationData;
      message: MessageData;
    }>(`${this.baseUrl}/conversations/with-message`, data);
    return response.data;
  }
}

export const messageService = new MessageService(); 