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
    @GetUser('id') userId: string,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {
    return this.notificationsService.getUserNotifications(userId, limit, offset);
  }

  @Get('unread-count')
  async getUnreadCount(@GetUser('id') userId: string) {
    const count = await this.notificationsService.getUnreadCount(userId);
    return { count };
  }

  @Post(':id/view')
  async markAsViewed(
    @Param('id') notificationId: string,
    @GetUser('id') userId: string,
  ) {
    return this.notificationsService.markAsViewed(notificationId, userId);
  }

  @Post('mark-all-viewed')
  async markAllAsViewed(@GetUser('id') userId: string) {
    return this.notificationsService.markAllAsViewed(userId);
  }

  @Delete(':id')
  async deleteNotification(
    @Param('id') notificationId: string,
    @GetUser('id') userId: string,
  ) {
    return this.notificationsService.deleteNotification(notificationId, userId);
  }

  @Delete()
  async deleteAllUserNotifications(@GetUser('id') userId: string) {
    return this.notificationsService.deleteAllUserNotifications(userId);
  }
}
