import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ClaimsService } from './claims.service';
import { CreateClaimDto } from './dto/create-claim.dto';
import { UpdateClaimDto } from './dto/update-claim.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('billing/claims')
@UseGuards(JwtAuthGuard)
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @Get()
  async getAllClaims(@Query('status') status?: string, @Query('providerId') providerId?: string) {
    return this.claimsService.getAllClaims(status, providerId);
  }

  @Get(':id')
  async getClaimById(@Param('id') id: string) {
    return this.claimsService.getClaimById(id);
  }

  @Post()
  async createClaim(@Body() createClaimDto: CreateClaimDto) {
    return this.claimsService.createClaim(createClaimDto);
  }

  @Put(':id')
  async updateClaim(@Param('id') id: string, @Body() updateClaimDto: UpdateClaimDto) {
    return this.claimsService.updateClaim(id, updateClaimDto);
  }

  @Delete(':id')
  async deleteClaim(@Param('id') id: string) {
    return this.claimsService.deleteClaim(id);
  }
} 