import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { DatabaseHealthIndicator } from './health/database.health';
import { NotificationService } from '../common/notification.service';

@Module({
  providers: [PrismaService, DatabaseHealthIndicator, NotificationService],
  exports: [PrismaService, DatabaseHealthIndicator, NotificationService],
})
export class DatabaseModule {} 