import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { TimeTrackingService } from './time-tracking.service';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('compliance/time-tracking')
@UseGuards(JwtAuthGuard)
export class TimeTrackingController {
  constructor(private readonly timeTrackingService: TimeTrackingService) {}

  @Get()
  async getAllTimeEntries(@Query('date') date?: string, @Query('userId') userId?: string) {
    return this.timeTrackingService.getAllTimeEntries(date, userId);
  }

  @Get(':id')
  async getTimeEntryById(@Param('id') id: string) {
    return this.timeTrackingService.getTimeEntryById(id);
  }

  @Post()
  async createTimeEntry(@Body() createTimeEntryDto: CreateTimeEntryDto) {
    return this.timeTrackingService.createTimeEntry(createTimeEntryDto);
  }

  @Put(':id')
  async updateTimeEntry(@Param('id') id: string, @Body() updateTimeEntryDto: UpdateTimeEntryDto) {
    return this.timeTrackingService.updateTimeEntry(id, updateTimeEntryDto);
  }

  @Delete(':id')
  async deleteTimeEntry(@Param('id') id: string) {
    return this.timeTrackingService.deleteTimeEntry(id);
  }

  @Post('clock-in')
  async clockIn(@Body() clockInDto: { userId: string }) {
    return this.timeTrackingService.clockIn(clockInDto.userId);
  }

  @Post(':id/clock-out')
  async clockOut(@Param('id') id: string) {
    return this.timeTrackingService.clockOut(id);
  }

  @Post(':id/approve')
  async approveTimeEntry(@Param('id') id: string, @Body() approveDto: { approvedBy: string }) {
    return this.timeTrackingService.approveTimeEntry(id, approveDto.approvedBy);
  }

  @Post(':id/ask-for-update')
  async askForUpdateTimeEntry(@Param('id') id: string, @Body() updateDto: { requestedBy: string; updateNotes?: string }) {
    return this.timeTrackingService.askForUpdateTimeEntry(id, updateDto.requestedBy, updateDto.updateNotes);
  }

  @Get('active/:userId')
  async getActiveTimeEntry(@Param('userId') userId: string) {
    return this.timeTrackingService.getActiveTimeEntry(userId);
  }
} 