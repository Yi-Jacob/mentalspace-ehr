import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllPayments(status?: string, search?: string) {
    const where: any = {};
    
    if (status && status !== 'all') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { paymentNumber: { contains: search, mode: 'insensitive' } },
        { client: { 
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
          ]
        }},
      ];
    }

    return this.prisma.payment.findMany({
      where,
      include: {
        client: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        payer: {
          select: {
            name: true,
          },
        },
        claim: {
          select: {
            claimNumber: true,
          },
        },
      },
      orderBy: {
        paymentDate: 'desc',
      },
    });
  }

  async getPaymentById(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        payer: {
          select: {
            name: true,
          },
        },
        claim: {
          select: {
            claimNumber: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return payment;
  }

  async createPayment(createPaymentDto: CreatePaymentDto) {
    return this.prisma.payment.create({
      data: {
        ...createPaymentDto,
        paymentDate: new Date(createPaymentDto.paymentDate),
      },
      include: {
        client: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        payer: {
          select: {
            name: true,
          },
        },
        claim: {
          select: {
            claimNumber: true,
          },
        },
      },
    });
  }

  async updatePayment(id: string, updatePaymentDto: UpdatePaymentDto) {
    const payment = await this.getPaymentById(id);

    const data: any = { ...updatePaymentDto };
    if (updatePaymentDto.paymentDate) {
      data.paymentDate = new Date(updatePaymentDto.paymentDate);
    }

    return this.prisma.payment.update({
      where: { id },
      data,
      include: {
        client: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        payer: {
          select: {
            name: true,
          },
        },
        claim: {
          select: {
            claimNumber: true,
          },
        },
      },
    });
  }

  async deletePayment(id: string) {
    const payment = await this.getPaymentById(id);

    return this.prisma.payment.delete({
      where: { id },
    });
  }
} 