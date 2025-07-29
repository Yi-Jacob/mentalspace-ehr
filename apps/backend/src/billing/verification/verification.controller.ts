import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { CreateVerificationDto } from './dto/create-verification.dto';
import { UpdateVerificationDto } from './dto/update-verification.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('billing/verification')
@UseGuards(JwtAuthGuard)
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Get()
  async getAllVerifications(@Query('status') status?: string, @Query('providerId') providerId?: string) {
    return this.verificationService.getAllVerifications(status, providerId);
  }

  @Get(':id')
  async getVerificationById(@Param('id') id: string) {
    return this.verificationService.getVerificationById(id);
  }

  @Post()
  async createVerification(@Body() createVerificationDto: CreateVerificationDto) {
    return this.verificationService.createVerification(createVerificationDto);
  }

  @Put(':id')
  async updateVerification(@Param('id') id: string, @Body() updateVerificationDto: UpdateVerificationDto) {
    return this.verificationService.updateVerification(id, updateVerificationDto);
  }

  @Delete(':id')
  async deleteVerification(@Param('id') id: string) {
    return this.verificationService.deleteVerification(id);
  }
} 