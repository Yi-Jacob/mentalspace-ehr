import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('billing/payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  async getAllPayments(@Query('status') status?: string, @Query('providerId') providerId?: string) {
    return this.paymentsService.getAllPayments(status, providerId);
  }

  @Get(':id')
  async getPaymentById(@Param('id') id: string) {
    return this.paymentsService.getPaymentById(id);
  }

  @Post()
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.createPayment(createPaymentDto);
  }

  @Put(':id')
  async updatePayment(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.updatePayment(id, updatePaymentDto);
  }

  @Delete(':id')
  async deletePayment(@Param('id') id: string) {
    return this.paymentsService.deletePayment(id);
  }
} 