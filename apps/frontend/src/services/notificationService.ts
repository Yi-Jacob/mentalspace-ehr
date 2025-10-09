import { apiClient } from './api-helper/client';
import { 
  NotificationData, 
  NotificationResponse, 
  CreateNotificationRequest, 
  MarkAsViewedResponse, 
  UnreadCountResponse 
} from '../types/notification';

export class NotificationService {
  private static readonly BASE_URL = '/notifications';

  /**
   * Get user's notifications with pagination
   */
  static async getNotifications(limit = 50, offset = 0): Promise<NotificationData[]> {
    try {
      const response = await apiClient.get<NotificationData[]>(
        `${this.BASE_URL}?limit=${limit}&offset=${offset}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  /**
   * Get unread notifications count
   */
  static async getUnreadCount(): Promise<number> {
    try {
      const response = await apiClient.get<UnreadCountResponse>(
        `${this.BASE_URL}/unread-count`
      );
      return response.data.count;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  }

  /**
   * Mark a notification as viewed
   */
  static async markAsViewed(notificationId: string): Promise<MarkAsViewedResponse> {
    try {
      const response = await apiClient.post<MarkAsViewedResponse>(
        `${this.BASE_URL}/${notificationId}/view`
      );
      return response.data;
    } catch (error) {
      console.error('Error marking notification as viewed:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as viewed
   */
  static async markAllAsViewed(): Promise<MarkAsViewedResponse> {
    try {
      const response = await apiClient.post<MarkAsViewedResponse>(
        `${this.BASE_URL}/mark-all-viewed`
      );
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as viewed:', error);
      throw error;
    }
  }

  /**
   * Delete a specific notification
   */
  static async deleteNotification(notificationId: string): Promise<void> {
    try {
      await apiClient.delete(`${this.BASE_URL}/${notificationId}`);
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  /**
   * Delete all user notifications
   */
  static async deleteAllNotifications(): Promise<void> {
    try {
      await apiClient.delete(this.BASE_URL);
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      throw error;
    }
  }

  /**
   * Create a new notification (for admin use)
   */
  static async createNotification(data: CreateNotificationRequest): Promise<NotificationData> {
    try {
      const response = await apiClient.post<NotificationData>(this.BASE_URL, data);
      return response.data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }
}
