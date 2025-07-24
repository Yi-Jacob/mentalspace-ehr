import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { TimeTrackingService } from './time-tracking.service';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/enums/user-role.enum';

@Controller('compliance/time-tracking')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TimeTrackingController {
  constructor(private readonly timeTrackingService: TimeTrackingService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async getAllTimeEntries(@Query('date') date?: string, @Query('userId') userId?: string) {
    return this.timeTrackingService.getAllTimeEntries(date, userId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async getTimeEntryById(@Param('id') id: string) {
    return this.timeTrackingService.getTimeEntryById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.PROVIDER)
  async createTimeEntry(@Body() createTimeEntryDto: CreateTimeEntryDto) {
    return this.timeTrackingService.createTimeEntry(createTimeEntryDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER)
  async updateTimeEntry(@Param('id') id: string, @Body() updateTimeEntryDto: UpdateTimeEntryDto) {
    return this.timeTrackingService.updateTimeEntry(id, updateTimeEntryDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async deleteTimeEntry(@Param('id') id: string) {
    return this.timeTrackingService.deleteTimeEntry(id);
  }

  @Post('clock-in')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER)
  async clockIn(@Body() clockInDto: { userId: string }) {
    return this.timeTrackingService.clockIn(clockInDto.userId);
  }

  @Post(':id/clock-out')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER)
  async clockOut(@Param('id') id: string) {
    return this.timeTrackingService.clockOut(id);
  }

  @Post(':id/approve')
  @Roles(UserRole.ADMIN, UserRole.BILLING)
  async approveTimeEntry(@Param('id') id: string, @Body() approveDto: { approvedBy: string }) {
    return this.timeTrackingService.approveTimeEntry(id, approveDto.approvedBy);
  }
} 