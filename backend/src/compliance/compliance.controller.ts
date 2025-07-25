import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { ComplianceService } from './compliance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/enums/user-role.enum';

@Controller('compliance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Get('dashboard')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async getComplianceDashboard() {
    return this.complianceService.getComplianceDashboard();
  }

  @Get('overview')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async getComplianceOverview() {
    return this.complianceService.getComplianceOverview();
  }

  @Get('metrics')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async getComplianceMetrics(@Request() req) {
    return this.complianceService.getComplianceMetrics(req.user.id);
  }

  @Get('payment-calculations')
  @Roles(UserRole.ADMIN, UserRole.BILLING)
  async getPaymentCalculations(
    @Query('status') status?: string,
    @Query('period') period?: string
  ) {
    return this.complianceService.getPaymentCalculations(status, period);
  }

  @Get('reports')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async getComplianceReports(
    @Query('timeRange') timeRange: string = '30',
    @Query('reportType') reportType: string = 'overview'
  ) {
    return this.complianceService.getComplianceReports(parseInt(timeRange), reportType);
  }
} 