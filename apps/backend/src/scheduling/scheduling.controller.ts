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
  AppointmentStatus,
} from './dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('scheduling')
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) {}

  @Post('appointments')
  createAppointment(@Body() createAppointmentDto: CreateAppointmentDto, @Request() req) {
    console.log(createAppointmentDto)
    return this.schedulingService.createAppointment(createAppointmentDto, req.user.id);
  }

  @Get('appointments')
  findAll(@Query() query: QueryAppointmentsDto) {
    return this.schedulingService.findAll(query);
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
  checkConflicts(@Body() checkConflictsDto: CheckConflictsDto) {
    return this.schedulingService.checkConflicts(checkConflictsDto);
  }

  @Post('waitlist')
  createWaitlistEntry(@Body() createWaitlistDto: CreateWaitlistDto) {
    return this.schedulingService.createWaitlistEntry(createWaitlistDto);
  }

  @Get('waitlist')
  getWaitlistEntries() {
    return this.schedulingService.getWaitlistEntries();
  }

  @Post('schedules')
  createProviderSchedule(@Body() createScheduleDto: CreateScheduleDto) {
    return this.schedulingService.createProviderSchedule(createScheduleDto);
  }

  @Get('schedules')
  getProviderSchedules(@Query('providerId') providerId?: string) {
    return this.schedulingService.getProviderSchedules(providerId);
  }

  @Get('schedules/exceptions')
  getScheduleExceptions() {
    return this.schedulingService.getScheduleExceptions();
  }
} 