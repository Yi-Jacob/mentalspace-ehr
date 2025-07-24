import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ClaimsService } from './claims.service';
import { CreateClaimDto } from './dto/create-claim.dto';
import { UpdateClaimDto } from './dto/update-claim.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/enums/user-role.enum';

@Controller('billing/claims')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async getAllClaims(@Query('status') status?: string, @Query('search') search?: string) {
    return this.claimsService.getAllClaims(status, search);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async getClaimById(@Param('id') id: string) {
    return this.claimsService.getClaimById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async createClaim(@Body() createClaimDto: CreateClaimDto) {
    return this.claimsService.createClaim(createClaimDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async updateClaim(@Param('id') id: string, @Body() updateClaimDto: UpdateClaimDto) {
    return this.claimsService.updateClaim(id, updateClaimDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.BILLING)
  async deleteClaim(@Param('id') id: string) {
    return this.claimsService.deleteClaim(id);
  }
} 