import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { SessionCompletionService } from './session-completion.service';
import { CreateSessionCompletionDto } from './dto/create-session-completion.dto';
import { UpdateSessionCompletionDto } from './dto/update-session-completion.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('compliance/session-completion')
@UseGuards(JwtAuthGuard)
export class SessionCompletionController {
  constructor(private readonly sessionCompletionService: SessionCompletionService) {}

  @Get()
  async getAllSessionCompletions(
    @Query('status') status?: string, 
    @Query('providerId') providerId?: string,
    @Query('clientId') clientId?: string
  ) {
    return this.sessionCompletionService.getAllSessionCompletions(status, providerId, clientId);
  }

  // Get sessions with deadlines for compliance page - MUST BE BEFORE @Get(':id')
  @Get('with-deadlines')
  async getSessionsWithDeadlines(@Query('providerId') providerId?: string) {
    return this.sessionCompletionService.getSessionsWithDeadlines(providerId);
  }

  // New endpoints for comprehensive session management - MUST BE BEFORE @Get(':id')
  @Get('compliance/deadlines/:providerId')
  async getComplianceDeadlines(@Param('providerId') providerId: string) {
    return this.sessionCompletionService.getComplianceDeadlines(providerId);
  }

  @Get('payment/calculation/:providerId')
  async getPaymentCalculation(
    @Param('providerId') providerId: string,
    @Query('payPeriodWeek') payPeriodWeek?: string
  ) {
    const targetPayPeriod = payPeriodWeek ? new Date(payPeriodWeek) : undefined;
    return this.sessionCompletionService.getPaymentCalculation(providerId, targetPayPeriod);
  }

  @Get('dashboard/:providerId')
  async getProviderDashboard(@Param('providerId') providerId: string) {
    return this.sessionCompletionService.getProviderDashboard(providerId);
  }

  @Get('analytics/:providerId')
  async getSessionAnalytics(
    @Param('providerId') providerId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    return this.sessionCompletionService.getSessionAnalytics(
      providerId,
      new Date(startDate),
      new Date(endDate)
    );
  }

  @Get('compliance/report/:providerId')
  async getWeeklyComplianceReport(
    @Param('providerId') providerId: string,
    @Query('weekStart') weekStart: string
  ) {
    return this.sessionCompletionService.getWeeklyComplianceReport(
      providerId,
      new Date(weekStart)
    );
  }

  // Now the parameterized routes
  @Get(':id')
  async getSessionCompletionById(@Param('id') id: string) {
    return this.sessionCompletionService.getSessionCompletionById(id);
  }

  @Post()
  async createSessionCompletion(@Body() createSessionCompletionDto: CreateSessionCompletionDto) {
    return this.sessionCompletionService.createSessionCompletion(createSessionCompletionDto);
  }

  @Put(':id')
  async updateSessionCompletion(@Param('id') id: string, @Body() updateSessionCompletionDto: UpdateSessionCompletionDto) {
    return this.sessionCompletionService.updateSessionCompletion(id, updateSessionCompletionDto);
  }

  @Delete(':id')
  async deleteSessionCompletion(@Param('id') id: string) {
    return this.sessionCompletionService.deleteSessionCompletion(id);
  }

  @Post(':id/sign-note')
  async signNote(@Param('id') id: string, @Body() signNoteDto: { signedBy: string }) {
    return this.sessionCompletionService.signNote(id, signNoteDto.signedBy);
  }

  @Post(':id/lock-session')
  async lockSession(@Param('id') id: string, @Body() lockSessionDto: { lockedBy: string; reason?: string }) {
    return this.sessionCompletionService.lockSession(id, lockSessionDto.lockedBy, lockSessionDto.reason);
  }

  @Post(':id/supervisor-override')
  async supervisorOverride(
    @Param('id') id: string,
    @Body() overrideDto: { overrideBy: string; reason: string }
  ) {
    return this.sessionCompletionService.supervisorOverride(id, overrideDto.overrideBy, overrideDto.reason);
  }

  @Post('from-appointment/:appointmentId')
  async createFromAppointment(@Param('appointmentId') appointmentId: string) {
    return this.sessionCompletionService.createFromAppointment(appointmentId);
  }

  @Post('bulk-from-appointments')
  async bulkCreateFromAppointments(@Body() body: { appointmentIds: string[] }) {
    return this.sessionCompletionService.bulkCreateFromAppointments(body.appointmentIds);
  }

  // Mark session as completed (note signed)
  @Post(':id/mark-completed')
  async markSessionAsCompleted(@Param('id') id: string) {
    return this.sessionCompletionService.markSessionAsCompleted(id);
  }
} 