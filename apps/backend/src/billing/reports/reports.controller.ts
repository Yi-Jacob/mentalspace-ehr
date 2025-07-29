import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('billing/reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('revenue')
  async getRevenueReports(@Query('timeRange') timeRange: string = '30') {
    return this.reportsService.getRevenueReports(timeRange);
  }

  @Get('claims')
  async getClaimsReports(@Query('timeRange') timeRange: string = '30') {
    return this.reportsService.getClaimsReports(timeRange);
  }

  @Get('payments')
  async getPaymentsReports(@Query('timeRange') timeRange: string = '30') {
    return this.reportsService.getPaymentsReports(timeRange);
  }

  @Get('verification')
  async getVerificationReports(@Query('timeRange') timeRange: string = '30') {
    return this.reportsService.getVerificationReports(timeRange);
  }
} 