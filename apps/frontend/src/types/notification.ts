export interface NotificationData {
  id: string;
  receiverId: string;
  content: string;
  isViewed: boolean;
  viewedAt?: string;
  associatedLink?: string;
  createdAt: string;
  updatedAt: string;
  receiver?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface NotificationResponse {
  notifications: NotificationData[];
  totalCount: number;
  unreadCount: number;
}

export interface CreateNotificationRequest {
  receiverId: string;
  content: string;
  associatedLink?: string;
}

export interface MarkAsViewedResponse {
  success: boolean;
  message: string;
}

export interface UnreadCountResponse {
  count: number;
}
