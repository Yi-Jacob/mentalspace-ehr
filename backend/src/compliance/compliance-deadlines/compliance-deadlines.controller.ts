import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ComplianceDeadlinesService } from './compliance-deadlines.service';
import { CreateComplianceDeadlineDto } from './dto/create-compliance-deadline.dto';
import { UpdateComplianceDeadlineDto } from './dto/update-compliance-deadline.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/enums/user-role.enum';

@Controller('compliance/deadlines')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ComplianceDeadlinesController {
  constructor(private readonly complianceDeadlinesService: ComplianceDeadlinesService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async getAllComplianceDeadlines(@Query('status') status?: string, @Query('providerId') providerId?: string) {
    return this.complianceDeadlinesService.getAllComplianceDeadlines(status, providerId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async getComplianceDeadlineById(@Param('id') id: string) {
    return this.complianceDeadlinesService.getComplianceDeadlineById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.BILLING)
  async createComplianceDeadline(@Body() createComplianceDeadlineDto: CreateComplianceDeadlineDto) {
    return this.complianceDeadlinesService.createComplianceDeadline(createComplianceDeadlineDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.BILLING)
  async updateComplianceDeadline(@Param('id') id: string, @Body() updateComplianceDeadlineDto: UpdateComplianceDeadlineDto) {
    return this.complianceDeadlinesService.updateComplianceDeadline(id, updateComplianceDeadlineDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async deleteComplianceDeadline(@Param('id') id: string) {
    return this.complianceDeadlinesService.deleteComplianceDeadline(id);
  }

  @Post(':id/mark-met')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER)
  async markDeadlineAsMet(@Param('id') id: string) {
    return this.complianceDeadlinesService.markDeadlineAsMet(id);
  }

  @Post('send-reminders')
  @Roles(UserRole.ADMIN, UserRole.BILLING)
  async sendReminders() {
    return this.complianceDeadlinesService.sendReminders();
  }
} 