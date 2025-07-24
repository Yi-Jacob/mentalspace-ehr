import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { DeadlineExceptionService } from './deadline-exception.service';
import { CreateDeadlineExceptionDto } from './dto/create-deadline-exception.dto';
import { UpdateDeadlineExceptionDto } from './dto/update-deadline-exception.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/enums/user-role.enum';

@Controller('compliance/deadline-exceptions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DeadlineExceptionController {
  constructor(private readonly deadlineExceptionService: DeadlineExceptionService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async getAllDeadlineExceptions(@Query('status') status?: string, @Query('providerId') providerId?: string) {
    return this.deadlineExceptionService.getAllDeadlineExceptions(status, providerId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async getDeadlineExceptionById(@Param('id') id: string) {
    return this.deadlineExceptionService.getDeadlineExceptionById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.PROVIDER)
  async createDeadlineException(@Body() createDeadlineExceptionDto: CreateDeadlineExceptionDto) {
    return this.deadlineExceptionService.createDeadlineException(createDeadlineExceptionDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER)
  async updateDeadlineException(@Param('id') id: string, @Body() updateDeadlineExceptionDto: UpdateDeadlineExceptionDto) {
    return this.deadlineExceptionService.updateDeadlineException(id, updateDeadlineExceptionDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async deleteDeadlineException(@Param('id') id: string) {
    return this.deadlineExceptionService.deleteDeadlineException(id);
  }

  @Post(':id/approve')
  @Roles(UserRole.ADMIN, UserRole.BILLING)
  async approveException(@Param('id') id: string, @Body() approveDto: { reviewedBy: string; reviewNotes?: string }) {
    return this.deadlineExceptionService.approveException(id, approveDto.reviewedBy, approveDto.reviewNotes);
  }

  @Post(':id/reject')
  @Roles(UserRole.ADMIN, UserRole.BILLING)
  async rejectException(@Param('id') id: string, @Body() rejectDto: { reviewedBy: string; reviewNotes?: string }) {
    return this.deadlineExceptionService.rejectException(id, rejectDto.reviewedBy, rejectDto.reviewNotes);
  }
} 