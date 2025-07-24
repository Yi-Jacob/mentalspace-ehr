import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PayerService } from './payer.service';
import { CreatePayerDto } from './dto/create-payer.dto';
import { UpdatePayerDto } from './dto/update-payer.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/enums/user-role.enum';

@Controller('billing/payers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PayerController {
  constructor(private readonly payerService: PayerService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async getAllPayers(@Query('search') search?: string) {
    return this.payerService.getAllPayers(search);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async getPayerById(@Param('id') id: string) {
    return this.payerService.getPayerById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.BILLING)
  async createPayer(@Body() createPayerDto: CreatePayerDto) {
    return this.payerService.createPayer(createPayerDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.BILLING)
  async updatePayer(@Param('id') id: string, @Body() updatePayerDto: UpdatePayerDto) {
    return this.payerService.updatePayer(id, updatePayerDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.BILLING)
  async deletePayer(@Param('id') id: string) {
    return this.payerService.deletePayer(id);
  }
} 