import { Injectable } from '@nestjs/common';
import { NotificationService } from '../common/notification.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly notificationService: NotificationService) {}

  /**
   * Get notifications for the current user
   */
  async getUserNotifications(userId: string, limit = 50, offset = 0) {
    return this.notificationService.getUserNotifications(userId, limit, offset);
  }

  /**
   * Get unread notifications count for the current user
   */
  async getUnreadCount(userId: string) {
    return this.notificationService.getUnreadCount(userId);
  }

  /**
   * Mark a notification as viewed
   */
  async markAsViewed(notificationId: string, userId: string) {
    // Verify the notification belongs to the user
    const notification = await this.notificationService.getUserNotifications(userId, 1000, 0);
    const userNotification = notification.find(n => n.id === notificationId);
    
    if (!userNotification) {
      throw new Error('Notification not found or access denied');
    }

    return this.notificationService.markAsViewed(notificationId);
  }

  /**
   * Mark all notifications as viewed for the current user
   */
  async markAllAsViewed(userId: string) {
    return this.notificationService.markAllAsViewed(userId);
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string, userId: string) {
    // Verify the notification belongs to the user
    const notification = await this.notificationService.getUserNotifications(userId, 1000, 0);
    const userNotification = notification.find(n => n.id === notificationId);
    
    if (!userNotification) {
      throw new Error('Notification not found or access denied');
    }

    return this.notificationService.deleteNotification(notificationId);
  }

  /**
   * Delete all notifications for the current user
   */
  async deleteAllUserNotifications(userId: string) {
    return this.notificationService.deleteAllUserNotifications(userId);
  }
}
