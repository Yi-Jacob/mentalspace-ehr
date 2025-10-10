import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getUserNotifications(
    @GetUser() user: any,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {
    const userId = user?.id;
    if (!userId) {
      throw new Error('User ID not found');
    }
    return this.notificationsService.getUserNotifications(userId, limit, offset);
  }

  @Get('unread-count')
  async getUnreadCount(@GetUser() user: any) {
    const userId = user?.id;
    if (!userId) {
      throw new Error('User ID not found');
    }
    const count = await this.notificationsService.getUnreadCount(userId);
    return { count };
  }

  @Post(':id/view')
  async markAsViewed(
    @Param('id') notificationId: string,
    @GetUser() user: any,
  ) {
    const userId = user?.id;
    if (!userId) {
      throw new Error('User ID not found');
    }
    return this.notificationsService.markAsViewed(notificationId, userId);
  }

  @Post('mark-all-viewed')
  async markAllAsViewed(@GetUser() user: any) {
    const userId = user?.id;
    if (!userId) {
      throw new Error('User ID not found');
    }
    return this.notificationsService.markAllAsViewed(userId);
  }

  @Delete(':id')
  async deleteNotification(
    @Param('id') notificationId: string,
    @GetUser() user: any,
  ) {
    const userId = user?.id;
    if (!userId) {
      throw new Error('User ID not found');
    }
    return this.notificationsService.deleteNotification(notificationId, userId);
  }

  @Delete()
  async deleteAllUserNotifications(@GetUser() user: any) {
    const userId = user?.id;
    if (!userId) {
      throw new Error('User ID not found');
    }
    return this.notificationsService.deleteAllUserNotifications(userId);
  }
}
