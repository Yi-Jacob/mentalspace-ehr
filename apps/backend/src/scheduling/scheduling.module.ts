import { Module } from '@nestjs/common';
import { SchedulingController } from './scheduling.controller';
import { SchedulingService } from './scheduling.service';
import { PrismaService } from '../database/prisma.service';
import { UserTypeService } from '../common/user-type.service';

@Module({
  controllers: [SchedulingController],
  providers: [SchedulingService, PrismaService, UserTypeService],
  exports: [SchedulingService],
})
export class SchedulingModule {} 