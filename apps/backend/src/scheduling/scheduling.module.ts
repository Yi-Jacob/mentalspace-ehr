import { Module } from '@nestjs/common';
import { SchedulingController } from './scheduling.controller';
import { SchedulingService } from './scheduling.service';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [SchedulingController],
  providers: [SchedulingService, PrismaService],
  exports: [SchedulingService],
})
export class SchedulingModule {} 