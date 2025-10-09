export class NotificationResponseDto {
  id: string;
  receiverId: string;
  content: string;
  isViewed: boolean;
  viewedAt?: Date;
  associatedLink?: string;
  createdAt: Date;
  updatedAt: Date;
  receiver?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}
