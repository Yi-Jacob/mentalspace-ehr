import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ProviderCompensationService } from './provider-compensation.service';
import { CreateProviderCompensationDto } from './dto/create-provider-compensation.dto';
import { UpdateProviderCompensationDto } from './dto/update-provider-compensation.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('compliance/provider-compensation')
@UseGuards(JwtAuthGuard)
export class ProviderCompensationController {
  constructor(private readonly providerCompensationService: ProviderCompensationService) {}

  @Get()
  async getAllProviderCompensations(@Query('status') status?: string, @Query('providerId') providerId?: string) {
    return this.providerCompensationService.getAllProviderCompensations(status, providerId);
  }

  @Get(':id')
  async getProviderCompensationById(@Param('id') id: string) {
    return this.providerCompensationService.getProviderCompensationById(id);
  }

  @Post()
  async createProviderCompensation(@Body() createProviderCompensationDto: CreateProviderCompensationDto) {
    return this.providerCompensationService.createProviderCompensation(createProviderCompensationDto);
  }

  @Put(':id')
  async updateProviderCompensation(@Param('id') id: string, @Body() updateProviderCompensationDto: UpdateProviderCompensationDto) {
    return this.providerCompensationService.updateProviderCompensation(id, updateProviderCompensationDto);
  }

  @Delete(':id')
  async deleteProviderCompensation(@Param('id') id: string) {
    return this.providerCompensationService.deleteProviderCompensation(id);
  }

  @Post(':id/approve')
  async approveCompensation(@Param('id') id: string, @Body() approveDto: { reviewedBy: string; reviewNotes?: string }) {
    return this.providerCompensationService.approveCompensation(id, approveDto.reviewedBy, approveDto.reviewNotes);
  }

  @Post(':id/reject')
  async rejectCompensation(@Param('id') id: string, @Body() rejectDto: { reviewedBy: string; reviewNotes?: string }) {
    return this.providerCompensationService.rejectCompensation(id, rejectDto.reviewedBy, rejectDto.reviewNotes);
  }
} 