import { Module } from '@nestjs/common';
import { SchedulingController } from './scheduling.controller';
import { SchedulingService } from './scheduling.service';
import { DatabaseModule } from '../database/database.module';
import { UserTypeService } from '../common/user-type.service';
import { GoogleCalendarService } from '../common/google-calendar.service';

@Module({
  imports: [DatabaseModule],
  controllers: [SchedulingController],
  providers: [SchedulingService, UserTypeService, GoogleCalendarService],
  exports: [SchedulingService],
})
export class SchedulingModule {} 