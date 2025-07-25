import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { ComplianceService } from './compliance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('compliance')
@UseGuards(JwtAuthGuard)
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Get('dashboard')
  async getComplianceDashboard() {
    return this.complianceService.getComplianceDashboard();
  }

  @Get('overview')
  async getComplianceOverview() {
    return this.complianceService.getComplianceOverview();
  }

  @Get('metrics')
  async getComplianceMetrics(@Request() req) {
    return this.complianceService.getComplianceMetrics(req.user.id);
  }

  @Get('payment-calculations')
  async getPaymentCalculations(
    @Query('status') status?: string,
    @Query('period') period?: string
  ) {
    return this.complianceService.getPaymentCalculations(status, period);
  }

  @Get('reports')
  async getComplianceReports(
    @Query('timeRange') timeRange: string = '30',
    @Query('reportType') reportType: string = 'overview'
  ) {
    return this.complianceService.getComplianceReports(parseInt(timeRange), reportType);
  }
} 