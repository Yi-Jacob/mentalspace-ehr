import { Module } from '@nestjs/common';
import { SchedulingController } from './scheduling.controller';
import { SchedulingService } from './scheduling.service';
import { PrismaService } from '../database/prisma.service';
import { UserTypeService } from '../common/user-type.service';
import { GoogleCalendarService } from '../common/google-calendar.service';

@Module({
  controllers: [SchedulingController],
  providers: [SchedulingService, PrismaService, UserTypeService, GoogleCalendarService],
  exports: [SchedulingService],
})
export class SchedulingModule {} 