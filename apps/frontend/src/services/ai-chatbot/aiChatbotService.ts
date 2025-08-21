import { ChatRequest, ChatResponse, ChatSession } from '@/types/aiChatbot';
import { apiClient } from './../api-helper/client';

export class AIChatbotService {
  private static readonly BASE_URL = '/ai-chatbot';

  static async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await apiClient.post<ChatResponse>(
        `${this.BASE_URL}/chat`,
        request
      );
      return response.data;
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw new Error('Failed to send message');
    }
  }

  static async getChatHistory(sessionId: string): Promise<any[]> {
    try {
      const response = await apiClient.get<any[]>(
        `${this.BASE_URL}/sessions/${sessionId}/history`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting chat history:', error);
      throw new Error('Failed to get chat history');
    }
  }

  static async getUserChatSessions(): Promise<ChatSession[]> {
    try {
      const response = await apiClient.get<ChatSession[]>(
        `${this.BASE_URL}/sessions`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting user chat sessions:', error);
      throw new Error('Failed to get chat sessions');
    }
  }
}
