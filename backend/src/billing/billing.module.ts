import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { PayerController } from './payer/payer.controller';
import { PayerService } from './payer/payer.service';
import { ContractController } from './contract/contract.controller';
import { ContractService } from './contract/contract.service';
import { FeeScheduleController } from './fee-schedule/fee-schedule.controller';
import { FeeScheduleService } from './fee-schedule/fee-schedule.service';
import { ClaimsController } from './claims/claims.controller';
import { ClaimsService } from './claims/claims.service';
import { PaymentsController } from './payments/payments.controller';
import { PaymentsService } from './payments/payments.service';
import { ReportsController } from './reports/reports.controller';
import { ReportsService } from './reports/reports.service';
import { VerificationController } from './verification/verification.controller';
import { VerificationService } from './verification/verification.service';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [
    BillingController,
    PayerController,
    ContractController,
    FeeScheduleController,
    ClaimsController,
    PaymentsController,
    ReportsController,
    VerificationController,
  ],
  providers: [
    BillingService,
    PayerService,
    ContractService,
    FeeScheduleService,
    ClaimsService,
    PaymentsService,
    ReportsService,
    VerificationService,
    PrismaService,
  ],
  exports: [
    BillingService,
    PayerService,
    ContractService,
    FeeScheduleService,
    ClaimsService,
    PaymentsService,
    ReportsService,
    VerificationService,
  ],
})
export class BillingModule {} 