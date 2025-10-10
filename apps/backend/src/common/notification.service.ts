import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

// Simple in-memory cache for notification counts
const notificationCountCache = new Map<string, { count: number; timestamp: number }>();
const CACHE_TTL = 10000; // 10 seconds cache

export interface CreateNotificationData {
  receiverId: string;
  content: string;
  associatedLink?: string;
}

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new notification for a user
   */
  async createNotification(data: CreateNotificationData) {
    try {
      // Automatically add frontend URL to associated link if provided
      let fullAssociatedLink = data.associatedLink;
      if (data.associatedLink && !data.associatedLink.startsWith('http')) {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        fullAssociatedLink = `${frontendUrl}${data.associatedLink.startsWith('/') ? '' : '/'}${data.associatedLink}`;
      }

      const notification = await this.prisma.notification.create({
        data: {
          receiverId: data.receiverId,
          content: data.content,
          associatedLink: fullAssociatedLink,
        },
        include: {
          receiver: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      // Invalidate cache for the receiver
      notificationCountCache.delete(data.receiverId);

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Create multiple notifications for multiple users
   */
  async createBulkNotifications(data: CreateNotificationData[]) {
    try {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      
      const notifications = await this.prisma.notification.createMany({
        data: data.map((item) => {
          // Automatically add frontend URL to associated link if provided
          let fullAssociatedLink = item.associatedLink;
          if (item.associatedLink && !item.associatedLink.startsWith('http')) {
            fullAssociatedLink = `${frontendUrl}${item.associatedLink.startsWith('/') ? '' : '/'}${item.associatedLink}`;
          }

          return {
            receiverId: item.receiverId,
            content: item.content,
            associatedLink: fullAssociatedLink,
          };
        }),
      });

      return notifications;
    } catch (error) {
      console.error('Error creating bulk notifications:', error);
      throw error;
    }
  }

  /**
   * Mark a notification as viewed
   */
  async markAsViewed(notificationId: string) {
    try {
      const notification = await this.prisma.notification.update({
        where: { id: notificationId },
        data: {
          isViewed: true,
          viewedAt: new Date(),
        },
      });

      // Invalidate cache for the receiver
      notificationCountCache.delete(notification.receiverId);

      return notification;
    } catch (error) {
      console.error('Error marking notification as viewed:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications for a user as viewed
   */
  async markAllAsViewed(userId: string) {
    try {
      const result = await this.prisma.notification.updateMany({
        where: {
          receiverId: userId,
          isViewed: false,
        },
        data: {
          isViewed: true,
          viewedAt: new Date(),
        },
      });

      // Invalidate cache for the user
      notificationCountCache.delete(userId);

      return result;
    } catch (error) {
      console.error('Error marking all notifications as viewed:', error);
      throw error;
    }
  }

  /**
   * Get notifications for a user
   */
  async getUserNotifications(userId: string, limit = 50, offset = 0) {
    try {
      const notifications = await this.prisma.notification.findMany({
        where: { receiverId: userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          receiver: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      return notifications;
    } catch (error) {
      console.error('Error getting user notifications:', error);
      throw error;
    }
  }

  /**
   * Get unread notifications count for a user
   */
  async getUnreadCount(userId: string) {
    try {
      // Check cache first
      const cached = notificationCountCache.get(userId);
      const now = Date.now();
      
      if (cached && (now - cached.timestamp) < CACHE_TTL) {
        return cached.count;
      }

      // Fetch from database
      const count = await this.prisma.notification.count({
        where: {
          receiverId: userId,
          isViewed: false,
        },
      });

      // Update cache
      notificationCountCache.set(userId, { count, timestamp: now });

      return count;
    } catch (error) {
      console.error('Error getting unread notifications count:', error);
      throw error;
    }
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string) {
    try {
      const notification = await this.prisma.notification.delete({
        where: { id: notificationId },
      });

      return notification;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  /**
   * Delete all notifications for a user
   */
  async deleteAllUserNotifications(userId: string) {
    try {
      const result = await this.prisma.notification.deleteMany({
        where: { receiverId: userId },
      });

      return result;
    } catch (error) {
      console.error('Error deleting all user notifications:', error);
      throw error;
    }
  }

  /**
   * Utility method to create appointment-related notifications
   */
  async createAppointmentNotification(
    userId: string,
    appointmentId: string,
    message: string,
    type: 'created' | 'updated' | 'cancelled' | 'reminder' = 'created'
  ) {
    const content = `Appointment ${type}: ${message}`;
    const associatedLink = `/appointments/${appointmentId}`;

    return this.createNotification({
      receiverId: userId,
      content,
      associatedLink,
    });
  }

  /**
   * Utility method to create note-related notifications
   */
  async createNoteNotification(
    userId: string,
    noteId: string,
    message: string,
    type: 'created' | 'signed' | 'locked' | 'unlocked' = 'created'
  ) {
    const content = `Clinical Note ${type}: ${message}`;
    const associatedLink = `/notes/${noteId}`;

    return this.createNotification({
      receiverId: userId,
      content,
      associatedLink,
    });
  }

  /**
   * Utility method to create message-related notifications
   */
  async createMessageNotification(
    userId: string,
    conversationId: string,
    message: string
  ) {
    const content = `New message: ${message}`;
    const associatedLink = `/messages/${conversationId}`;

    return this.createNotification({
      receiverId: userId,
      content,
      associatedLink,
    });
  }

  /**
   * Utility method to create deadline-related notifications
   */
  async createDeadlineNotification(
    userId: string,
    deadlineType: string,
    message: string,
    deadlineId?: string
  ) {
    const content = `Deadline ${deadlineType}: ${message}`;
    const associatedLink = deadlineId ? `/compliance/deadlines/${deadlineId}` : '/compliance';

    return this.createNotification({
      receiverId: userId,
      content,
      associatedLink,
    });
  }
}
