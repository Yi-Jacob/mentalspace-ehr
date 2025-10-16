import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ComplianceController } from './compliance.controller';
import { ComplianceService } from './compliance.service';
import { TimeTrackingController } from './time-tracking/time-tracking.controller';
import { TimeTrackingService } from './time-tracking/time-tracking.service';
import { ComplianceDeadlinesController } from './compliance-deadlines/compliance-deadlines.controller';
import { ComplianceDeadlinesService } from './compliance-deadlines/compliance-deadlines.service';
import { ProviderCompensationController } from './provider-compensation/provider-compensation.controller';
import { ProviderCompensationService } from './provider-compensation/provider-compensation.service';
import { PaymentCalculationModule } from './payment-calculation/payment-calculation.module';

@Module({
  imports: [DatabaseModule, PaymentCalculationModule],
  controllers: [
    ComplianceController,
    TimeTrackingController,
    ComplianceDeadlinesController,
    ProviderCompensationController,
  ],
  providers: [
    ComplianceService,
    TimeTrackingService,
    ComplianceDeadlinesService,
    ProviderCompensationService,
  ],
  exports: [
    ComplianceService,
    TimeTrackingService,
    ComplianceDeadlinesService,
    ProviderCompensationService,
    PaymentCalculationModule,
  ],
})
export class ComplianceModule {} 