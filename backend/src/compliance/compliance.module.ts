import { Module } from '@nestjs/common';
import { ComplianceController } from './compliance.controller';
import { ComplianceService } from './compliance.service';
import { TimeTrackingController } from './time-tracking/time-tracking.controller';
import { TimeTrackingService } from './time-tracking/time-tracking.service';
import { ComplianceDeadlinesController } from './compliance-deadlines/compliance-deadlines.controller';
import { ComplianceDeadlinesService } from './compliance-deadlines/compliance-deadlines.service';
import { SessionCompletionController } from './session-completion/session-completion.controller';
import { SessionCompletionService } from './session-completion/session-completion.service';
import { ProviderCompensationController } from './provider-compensation/provider-compensation.controller';
import { ProviderCompensationService } from './provider-compensation/provider-compensation.service';
import { DeadlineExceptionController } from './deadline-exception/deadline-exception.controller';
import { DeadlineExceptionService } from './deadline-exception/deadline-exception.service';

@Module({
  controllers: [
    ComplianceController,
    TimeTrackingController,
    ComplianceDeadlinesController,
    SessionCompletionController,
    ProviderCompensationController,
    DeadlineExceptionController,
  ],
  providers: [
    ComplianceService,
    TimeTrackingService,
    ComplianceDeadlinesService,
    SessionCompletionService,
    ProviderCompensationService,
    DeadlineExceptionService,
  ],
  exports: [
    ComplianceService,
    TimeTrackingService,
    ComplianceDeadlinesService,
    SessionCompletionService,
    ProviderCompensationService,
    DeadlineExceptionService,
  ],
})
export class ComplianceModule {} 