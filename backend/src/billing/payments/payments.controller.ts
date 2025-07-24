import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/enums/user-role.enum';

@Controller('billing/payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async getAllPayments(@Query('status') status?: string, @Query('search') search?: string) {
    return this.paymentsService.getAllPayments(status, search);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async getPaymentById(@Param('id') id: string) {
    return this.paymentsService.getPaymentById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.createPayment(createPaymentDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async updatePayment(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.updatePayment(id, updatePaymentDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.BILLING)
  async deletePayment(@Param('id') id: string) {
    return this.paymentsService.deletePayment(id);
  }
} 