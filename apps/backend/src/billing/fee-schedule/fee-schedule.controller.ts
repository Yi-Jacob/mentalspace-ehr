import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { FeeScheduleService } from './fee-schedule.service';
import { CreateFeeScheduleDto } from './dto/create-fee-schedule.dto';
import { UpdateFeeScheduleDto } from './dto/update-fee-schedule.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('billing/fee-schedule')
@UseGuards(JwtAuthGuard)
export class FeeScheduleController {
  constructor(private readonly feeScheduleService: FeeScheduleService) {}

  @Get()
  async getAllFeeSchedules(@Query('status') status?: string, @Query('providerId') providerId?: string) {
    return this.feeScheduleService.getAllFeeSchedules(status, providerId);
  }

  @Get(':id')
  async getFeeScheduleById(@Param('id') id: string) {
    return this.feeScheduleService.getFeeScheduleById(id);
  }

  @Post()
  async createFeeSchedule(@Body() createFeeScheduleDto: CreateFeeScheduleDto) {
    return this.feeScheduleService.createFeeSchedule(createFeeScheduleDto);
  }

  @Put(':id')
  async updateFeeSchedule(@Param('id') id: string, @Body() updateFeeScheduleDto: UpdateFeeScheduleDto) {
    return this.feeScheduleService.updateFeeSchedule(id, updateFeeScheduleDto);
  }

  @Delete(':id')
  async deleteFeeSchedule(@Param('id') id: string) {
    return this.feeScheduleService.deleteFeeSchedule(id);
  }

  @Post(':id/approve')
  async approveFeeSchedule(@Param('id') id: string, @Body() approveDto: { reviewedBy: string; reviewNotes?: string }) {
    return this.feeScheduleService.approveFeeSchedule(id, approveDto.reviewedBy, approveDto.reviewNotes);
  }

  @Post(':id/reject')
  async rejectFeeSchedule(@Param('id') id: string, @Body() rejectDto: { reviewedBy: string; reviewNotes?: string }) {
    return this.feeScheduleService.rejectFeeSchedule(id, rejectDto.reviewedBy, rejectDto.reviewNotes);
  }
} 