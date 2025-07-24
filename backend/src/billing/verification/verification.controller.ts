import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { CreateVerificationDto } from './dto/create-verification.dto';
import { UpdateVerificationDto } from './dto/update-verification.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/enums/user-role.enum';

@Controller('billing/verifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async getAllVerifications(@Query('clientId') clientId?: string) {
    return this.verificationService.getAllVerifications(clientId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async getVerificationById(@Param('id') id: string) {
    return this.verificationService.getVerificationById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async createVerification(@Body() createVerificationDto: CreateVerificationDto) {
    return this.verificationService.createVerification(createVerificationDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async updateVerification(@Param('id') id: string, @Body() updateVerificationDto: UpdateVerificationDto) {
    return this.verificationService.updateVerification(id, updateVerificationDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.BILLING)
  async deleteVerification(@Param('id') id: string) {
    return this.verificationService.deleteVerification(id);
  }
} 