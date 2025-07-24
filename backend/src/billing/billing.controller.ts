import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/enums/user-role.enum';

@Controller('billing')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('dashboard')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async getBillingDashboard(@Query('timeRange') timeRange: string = '30') {
    return this.billingService.getBillingDashboard(timeRange);
  }

  @Get('overview')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async getBillingOverview(@Query('timeRange') timeRange: string = '30') {
    return this.billingService.getBillingOverview(timeRange);
  }

  @Get('metrics')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async getBillingMetrics(@Query('timeRange') timeRange: string = '30') {
    return this.billingService.getBillingMetrics(timeRange);
  }
} 