import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('billing')
@UseGuards(JwtAuthGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('dashboard')
  async getBillingDashboard(@Query('timeRange') timeRange: string = '30') {
    return this.billingService.getBillingDashboard(timeRange);
  }

  @Get('overview')
  async getBillingOverview(@Query('timeRange') timeRange: string = '30') {
    return this.billingService.getBillingOverview(timeRange);
  }

  @Get('metrics')
  async getBillingMetrics(@Query('timeRange') timeRange: string = '30') {
    return this.billingService.getBillingMetrics(timeRange);
  }
} 