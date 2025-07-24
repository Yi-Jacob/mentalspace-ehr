import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/enums/user-role.enum';

@Controller('billing/reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('billing')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async getBillingReports(@Query('timeRange') timeRange: string = '30') {
    return this.reportsService.getBillingReports(timeRange);
  }

  @Get('revenue')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async getRevenueReports(@Query('timeRange') timeRange: string = '30') {
    return this.reportsService.getRevenueReports(timeRange);
  }

  @Get('claims')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async getClaimsReports(@Query('timeRange') timeRange: string = '30') {
    return this.reportsService.getClaimsReports(timeRange);
  }

  @Get('payments')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async getPaymentsReports(@Query('timeRange') timeRange: string = '30') {
    return this.reportsService.getPaymentsReports(timeRange);
  }
} 