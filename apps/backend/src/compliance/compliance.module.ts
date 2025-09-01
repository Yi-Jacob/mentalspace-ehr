import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ComplianceController } from './compliance.controller';
import { ComplianceService } from './compliance.service';
import { TimeTrackingController } from './time-tracking/time-tracking.controller';
import { TimeTrackingService } from './time-tracking/time-tracking.service';
import { ComplianceDeadlinesController } from './compliance-deadlines/compliance-deadlines.controller';
import { ComplianceDeadlinesService } from './compliance-deadlines/compliance-deadlines.service';
import { SessionCompletionModule } from './session-completion/session-completion.module';
import { ProviderCompensationController } from './provider-compensation/provider-compensation.controller';
import { ProviderCompensationService } from './provider-compensation/provider-compensation.service';
import { DeadlineExceptionController } from './deadline-exception/deadline-exception.controller';
import { DeadlineExceptionService } from './deadline-exception/deadline-exception.service';

@Module({
  imports: [DatabaseModule, SessionCompletionModule],
  controllers: [
    ComplianceController,
    TimeTrackingController,
    ComplianceDeadlinesController,
    ProviderCompensationController,
    DeadlineExceptionController,
  ],
  providers: [
    ComplianceService,
    TimeTrackingService,
    ComplianceDeadlinesService,
    ProviderCompensationService,
    DeadlineExceptionService,
  ],
  exports: [
    ComplianceService,
    TimeTrackingService,
    ComplianceDeadlinesService,
    ProviderCompensationService,
    DeadlineExceptionService,
    SessionCompletionModule,
  ],
})
export class ComplianceModule {} 