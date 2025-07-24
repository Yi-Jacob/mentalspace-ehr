import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { FeeScheduleService } from './fee-schedule.service';
import { CreateFeeScheduleDto } from './dto/create-fee-schedule.dto';
import { UpdateFeeScheduleDto } from './dto/update-fee-schedule.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/enums/user-role.enum';

@Controller('billing/fee-schedules')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FeeScheduleController {
  constructor(private readonly feeScheduleService: FeeScheduleService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async getAllFeeSchedules(@Query('payerId') payerId?: string) {
    return this.feeScheduleService.getAllFeeSchedules(payerId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async getFeeScheduleById(@Param('id') id: string) {
    return this.feeScheduleService.getFeeScheduleById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.BILLING)
  async createFeeSchedule(@Body() createFeeScheduleDto: CreateFeeScheduleDto) {
    return this.feeScheduleService.createFeeSchedule(createFeeScheduleDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.BILLING)
  async updateFeeSchedule(@Param('id') id: string, @Body() updateFeeScheduleDto: UpdateFeeScheduleDto) {
    return this.feeScheduleService.updateFeeSchedule(id, updateFeeScheduleDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.BILLING)
  async deleteFeeSchedule(@Param('id') id: string) {
    return this.feeScheduleService.deleteFeeSchedule(id);
  }

  @Get('cpt-codes')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async getCptCodes() {
    return this.feeScheduleService.getCptCodes();
  }
} 