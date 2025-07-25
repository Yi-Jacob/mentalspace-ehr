import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ComplianceDeadlinesService } from './compliance-deadlines.service';
import { CreateComplianceDeadlineDto } from './dto/create-compliance-deadline.dto';
import { UpdateComplianceDeadlineDto } from './dto/update-compliance-deadline.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('compliance/deadlines')
@UseGuards(JwtAuthGuard)
export class ComplianceDeadlinesController {
  constructor(private readonly complianceDeadlinesService: ComplianceDeadlinesService) {}

  @Get()
  async getAllComplianceDeadlines(@Query('status') status?: string, @Query('providerId') providerId?: string) {
    return this.complianceDeadlinesService.getAllComplianceDeadlines(status, providerId);
  }

  @Get(':id')
  async getComplianceDeadlineById(@Param('id') id: string) {
    return this.complianceDeadlinesService.getComplianceDeadlineById(id);
  }

  @Post()
  async createComplianceDeadline(@Body() createComplianceDeadlineDto: CreateComplianceDeadlineDto) {
    return this.complianceDeadlinesService.createComplianceDeadline(createComplianceDeadlineDto);
  }

  @Put(':id')
  async updateComplianceDeadline(@Param('id') id: string, @Body() updateComplianceDeadlineDto: UpdateComplianceDeadlineDto) {
    return this.complianceDeadlinesService.updateComplianceDeadline(id, updateComplianceDeadlineDto);
  }

  @Delete(':id')
  async deleteComplianceDeadline(@Param('id') id: string) {
    return this.complianceDeadlinesService.deleteComplianceDeadline(id);
  }

  @Post(':id/approve')
  async approveDeadline(@Param('id') id: string, @Body() approveDto: { reviewedBy: string; reviewNotes?: string }) {
    return this.complianceDeadlinesService.approveDeadline(id, approveDto.reviewedBy, approveDto.reviewNotes);
  }

  @Post(':id/reject')
  async rejectDeadline(@Param('id') id: string, @Body() rejectDto: { reviewedBy: string; reviewNotes?: string }) {
    return this.complianceDeadlinesService.rejectDeadline(id, rejectDto.reviewedBy, rejectDto.reviewNotes);
  }
} 