import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('executive-dashboard')
  async getExecutiveDashboard(@Query('timeRange') timeRange: string = '30') {
    return this.reportsService.getExecutiveDashboard(timeRange);
  }

  @Get('clinical')
  async getClinicalReports(
    @Query('timeRange') timeRange: string = '30',
    @Query('providerFilter') providerFilter?: string
  ) {
    return this.reportsService.getClinicalReports(timeRange, providerFilter);
  }

  @Get('staff')
  async getStaffReports(@Query('timeRange') timeRange: string = '30') {
    return this.reportsService.getStaffReports(timeRange);
  }

  @Get('billing')
  async getBillingReports(@Query('timeRange') timeRange: string = '30') {
    return this.reportsService.getBillingReports(timeRange);
  }

  @Get('scheduling')
  async getSchedulingReports(@Query('timeRange') timeRange: string = '30') {
    return this.reportsService.getSchedulingReports(timeRange);
  }
} 