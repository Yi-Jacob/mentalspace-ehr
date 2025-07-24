import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/enums/user-role.enum';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('executive-dashboard')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async getExecutiveDashboard(@Query('timeRange') timeRange: string = '30') {
    return this.reportsService.getExecutiveDashboard(timeRange);
  }

  @Get('clinical')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async getClinicalReports(
    @Query('timeRange') timeRange: string = '30',
    @Query('providerFilter') providerFilter?: string
  ) {
    return this.reportsService.getClinicalReports(timeRange, providerFilter);
  }

  @Get('staff')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async getStaffReports(@Query('timeRange') timeRange: string = '30') {
    return this.reportsService.getStaffReports(timeRange);
  }

  @Get('billing')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async getBillingReports(@Query('timeRange') timeRange: string = '30') {
    return this.reportsService.getBillingReports(timeRange);
  }

  @Get('scheduling')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async getSchedulingReports(@Query('timeRange') timeRange: string = '30') {
    return this.reportsService.getSchedulingReports(timeRange);
  }
} 