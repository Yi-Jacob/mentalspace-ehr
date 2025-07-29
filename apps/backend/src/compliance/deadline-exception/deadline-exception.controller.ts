import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { DeadlineExceptionService } from './deadline-exception.service';
import { CreateDeadlineExceptionDto } from './dto/create-deadline-exception.dto';
import { UpdateDeadlineExceptionDto } from './dto/update-deadline-exception.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('compliance/deadline-exceptions')
@UseGuards(JwtAuthGuard)
export class DeadlineExceptionController {
  constructor(private readonly deadlineExceptionService: DeadlineExceptionService) {}

  @Get()
  async getAllDeadlineExceptions(@Query('status') status?: string, @Query('providerId') providerId?: string) {
    return this.deadlineExceptionService.getAllDeadlineExceptions(status, providerId);
  }

  @Get(':id')
  async getDeadlineExceptionById(@Param('id') id: string) {
    return this.deadlineExceptionService.getDeadlineExceptionById(id);
  }

  @Post()
  async createDeadlineException(@Body() createDeadlineExceptionDto: CreateDeadlineExceptionDto) {
    return this.deadlineExceptionService.createDeadlineException(createDeadlineExceptionDto);
  }

  @Put(':id')
  async updateDeadlineException(@Param('id') id: string, @Body() updateDeadlineExceptionDto: UpdateDeadlineExceptionDto) {
    return this.deadlineExceptionService.updateDeadlineException(id, updateDeadlineExceptionDto);
  }

  @Delete(':id')
  async deleteDeadlineException(@Param('id') id: string) {
    return this.deadlineExceptionService.deleteDeadlineException(id);
  }

  @Post(':id/approve')
  async approveException(@Param('id') id: string, @Body() approveDto: { reviewedBy: string; reviewNotes?: string }) {
    return this.deadlineExceptionService.approveException(id, approveDto.reviewedBy, approveDto.reviewNotes);
  }

  @Post(':id/reject')
  async rejectException(@Param('id') id: string, @Body() rejectDto: { reviewedBy: string; reviewNotes?: string }) {
    return this.deadlineExceptionService.rejectException(id, rejectDto.reviewedBy, rejectDto.reviewNotes);
  }
} 