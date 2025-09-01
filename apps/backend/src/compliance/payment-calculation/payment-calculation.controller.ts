import { Controller, Get, Post, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { PaymentCalculationService } from './payment-calculation.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('compliance/payment-calculation')
@UseGuards(JwtAuthGuard)
export class PaymentCalculationController {
  constructor(private readonly paymentCalculationService: PaymentCalculationService) {}

  @Get('weekly/:providerId')
  async getWeeklyPaymentCalculation(
    @Param('providerId') providerId: string,
    @Query('payPeriodWeek') payPeriodWeek?: string
  ) {
    const targetPayPeriod = payPeriodWeek ? new Date(payPeriodWeek) : undefined;
    return this.paymentCalculationService.calculateWeeklyPayment(providerId, targetPayPeriod);
  }

  @Get('weekly')
  async getWeeklyPaymentCalculations(@Query('payPeriodWeek') payPeriodWeek?: string) {
    const targetPayPeriod = payPeriodWeek ? new Date(payPeriodWeek) : undefined;
    return this.paymentCalculationService.getWeeklyPaymentCalculations(targetPayPeriod);
  }

  @Post('process/:providerId')
  async processPayment(
    @Param('providerId') providerId: string,
    @Query('payPeriodWeek') payPeriodWeek?: string,
    @Request() req?: any
  ) {
    const targetPayPeriod = payPeriodWeek ? new Date(payPeriodWeek) : undefined;
    const processedBy = req?.user?.id;
    return this.paymentCalculationService.processPayment(providerId, targetPayPeriod, processedBy);
  }

  @Get('history/:providerId')
  async getPaymentHistory(
    @Param('providerId') providerId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.paymentCalculationService.getPaymentHistory(providerId, start, end);
  }

  @Get('all')
  async getAllPaymentCalculations(
    @Query('status') status?: string,
    @Query('providerId') providerId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const filters = {
      status,
      providerId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };
    return this.paymentCalculationService.getAllPaymentCalculations(filters);
  }

  @Get('compliance/:providerId')
  async getPaymentComplianceStatus(
    @Param('providerId') providerId: string,
    @Query('payPeriodWeek') payPeriodWeek?: string
  ) {
    const targetPayPeriod = payPeriodWeek ? new Date(payPeriodWeek) : undefined;
    return this.paymentCalculationService.getPaymentComplianceStatus(providerId, targetPayPeriod);
  }
}
