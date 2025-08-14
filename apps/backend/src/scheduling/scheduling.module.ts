import { Module } from '@nestjs/common';
import { SchedulingController } from './scheduling.controller';
import { SchedulingService } from './scheduling.service';
import { RecurringRuleController } from './recurring-rule.controller';
import { RecurringRuleService } from './recurring-rule.service';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [SchedulingController, RecurringRuleController],
  providers: [SchedulingService, RecurringRuleService, PrismaService],
  exports: [SchedulingService, RecurringRuleService],
})
export class SchedulingModule {} 