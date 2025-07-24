import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ProviderCompensationService } from './provider-compensation.service';
import { CreateProviderCompensationDto } from './dto/create-provider-compensation.dto';
import { UpdateProviderCompensationDto } from './dto/update-provider-compensation.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/enums/user-role.enum';

@Controller('compliance/provider-compensation')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProviderCompensationController {
  constructor(private readonly providerCompensationService: ProviderCompensationService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async getAllProviderCompensations(@Query('providerId') providerId?: string) {
    return this.providerCompensationService.getAllProviderCompensations(providerId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async getProviderCompensationById(@Param('id') id: string) {
    return this.providerCompensationService.getProviderCompensationById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.BILLING)
  async createProviderCompensation(@Body() createProviderCompensationDto: CreateProviderCompensationDto) {
    return this.providerCompensationService.createProviderCompensation(createProviderCompensationDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.BILLING)
  async updateProviderCompensation(@Param('id') id: string, @Body() updateProviderCompensationDto: UpdateProviderCompensationDto) {
    return this.providerCompensationService.updateProviderCompensation(id, updateProviderCompensationDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async deleteProviderCompensation(@Param('id') id: string) {
    return this.providerCompensationService.deleteProviderCompensation(id);
  }

  @Get('session-multipliers')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async getSessionMultipliers(@Query('providerId') providerId?: string) {
    return this.providerCompensationService.getSessionMultipliers(providerId);
  }
} 