import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PayerService } from './payer.service';
import { CreatePayerDto } from './dto/create-payer.dto';
import { UpdatePayerDto } from './dto/update-payer.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('billing/payer')
@UseGuards(JwtAuthGuard)
export class PayerController {
  constructor(private readonly payerService: PayerService) {}

  @Get()
  async getAllPayers(@Query('status') status?: string, @Query('providerId') providerId?: string) {
    return this.payerService.getAllPayers(status, providerId);
  }

  @Get(':id')
  async getPayerById(@Param('id') id: string) {
    return this.payerService.getPayerById(id);
  }

  @Post()
  async createPayer(@Body() createPayerDto: CreatePayerDto) {
    return this.payerService.createPayer(createPayerDto);
  }

  @Put(':id')
  async updatePayer(@Param('id') id: string, @Body() updatePayerDto: UpdatePayerDto) {
    return this.payerService.updatePayer(id, updatePayerDto);
  }

  @Delete(':id')
  async deletePayer(@Param('id') id: string) {
    return this.payerService.deletePayer(id);
  }
} 