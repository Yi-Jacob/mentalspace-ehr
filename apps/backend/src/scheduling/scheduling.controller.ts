import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SchedulingService } from './scheduling.service';
import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
  QueryAppointmentsDto,
  CheckConflictsDto,
  CreateWaitlistDto,
  CreateScheduleDto,
  CreateScheduleExceptionDto,
  AppointmentStatus,
} from './dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// Interface for the authenticated user from JWT
interface AuthenticatedUser {
  id: string;
  email: string;
  roles: string[];
}

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('scheduling')
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) {}

  @Post('appointments')
  createAppointment(@Body() createAppointmentDto: CreateAppointmentDto, @Request() req) {
    return this.schedulingService.createAppointment(createAppointmentDto, req.user.id);
  }

  @Get('appointments')
  findAll(@Query() query: QueryAppointmentsDto, @Request() req: { user: AuthenticatedUser }) {
    return this.schedulingService.findAll(query, req.user);
  }

  @Get('appointments/client/:clientId')
  getClientAppointments(@Param('clientId') clientId: string, @Request() req: { user: AuthenticatedUser }) {
    return this.schedulingService.getClientAppointments(clientId, req.user);
  }

  @Get('appointments/:id')
  findOne(@Param('id') id: string) {
    return this.schedulingService.findOne(id);
  }

  @Patch('appointments/:id')
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.schedulingService.update(id, updateAppointmentDto);
  }

  @Patch('appointments/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: AppointmentStatus,
  ) {
    return this.schedulingService.updateStatus(id, status);
  }

  @Delete('appointments/:id')
  remove(@Param('id') id: string) {
    return this.schedulingService.remove(id);
  }

  @Post('conflicts/check')
  checkConflicts(@Body() checkConflictsDto: CheckConflictsDto, @Request() req: any) {
    const providerId = req.user?.id;
    return this.schedulingService.checkConflicts(checkConflictsDto, providerId);
  }

  @Post('waitlist')
  createWaitlistEntry(@Body() createWaitlistDto: CreateWaitlistDto) {
    return this.schedulingService.createWaitlistEntry(createWaitlistDto);
  }

  @Get('waitlist')
  getWaitlistEntries(@Request() req: any) {
    const userId = req.user?.id;
    const userRole = req.user?.roles?.[0]; // Assuming roles is an array
    return this.schedulingService.getWaitlistEntries(userId, userRole);
  }

  @Delete('waitlist/:id')
  cancelWaitlistEntry(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.id;
    return this.schedulingService.cancelWaitlistEntry(id, userId);
  }

  @Patch('waitlist/:id/fulfill')
  fulfillWaitlistEntry(@Param('id') id: string, @Body() body: { appointmentId: string }) {
    return this.schedulingService.fulfillWaitlistEntry(id, body.appointmentId);
  }

  @Post('schedules')
  createProviderSchedule(@Body() createScheduleDto: CreateScheduleDto, @Request() req) {
    return this.schedulingService.createProviderSchedule(createScheduleDto, req.user.id);
  }

  @Post('schedules/bulk')
  createProviderSchedules(@Body() createSchedulesDto: CreateScheduleDto[], @Request() req) {
    return this.schedulingService.createProviderSchedules(createSchedulesDto, req.user.id);
  }

  @Patch('schedules/bulk')
  updateProviderSchedules(@Body() updateSchedulesDto: CreateScheduleDto[], @Request() req) {
    return this.schedulingService.updateProviderSchedules(updateSchedulesDto, req.user.id);
  }

  @Delete('schedules/all')
  deleteAllProviderSchedules(@Request() req) {
    return this.schedulingService.deleteAllProviderSchedules(req.user.id);
  }

  @Get('schedules')
  getProviderSchedules(@Query('providerId') providerId: string, @Request() req) {
    const userId = req.user?.id;
    return this.schedulingService.getProviderSchedules(providerId || userId);
  }

  @Get('schedules/exceptions')
  getScheduleExceptions(@Query('providerId') providerId: string, @Request() req) {
    const userId = req.user?.id;
    return this.schedulingService.getScheduleExceptions(providerId || userId);
  }

  @Post('schedules/exceptions')
  createScheduleException(@Body() createExceptionDto: CreateScheduleExceptionDto, @Request() req) {
    return this.schedulingService.createScheduleException(createExceptionDto, req.user.id);
  }

  @Patch('schedules/exceptions/:id')
  updateScheduleException(
    @Param('id') id: string,
    @Body() updateExceptionDto: CreateScheduleExceptionDto,
    @Request() req
  ) {
    return this.schedulingService.updateScheduleException(id, updateExceptionDto, req.user.id);
  }

  @Delete('schedules/exceptions/:id')
  deleteScheduleException(@Param('id') id: string, @Request() req) {
    return this.schedulingService.deleteScheduleException(id, req.user.id);
  }
} 