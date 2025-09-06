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
        allocations: {
          include: {
            claimLineItem: {
              select: {
                cptCode: true,
                serviceDate: true,
                chargeAmount: true,
              },
            },
          },
        },
        adjustments: {
          include: {
            claimLineItem: {
              select: {
                cptCode: true,
                serviceDate: true,
              },
            },
            createdBy: {
              select: {
                formalName: true,
                jobTitle: true,
              },
            },
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
        allocations: {
          include: {
            claimLineItem: {
              select: {
                cptCode: true,
                serviceDate: true,
                chargeAmount: true,
              },
            },
          },
        },
        adjustments: {
          include: {
            claimLineItem: {
              select: {
                cptCode: true,
                serviceDate: true,
              },
            },
            createdBy: {
              select: {
                formalName: true,
                jobTitle: true,
              },
            },
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
        allocations: {
          include: {
            claimLineItem: {
              select: {
                cptCode: true,
                serviceDate: true,
                chargeAmount: true,
              },
            },
          },
        },
        adjustments: {
          include: {
            claimLineItem: {
              select: {
                cptCode: true,
                serviceDate: true,
              },
            },
            createdBy: {
              select: {
                formalName: true,
                jobTitle: true,
              },
            },
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
        allocations: {
          include: {
            claimLineItem: {
              select: {
                cptCode: true,
                serviceDate: true,
                chargeAmount: true,
              },
            },
          },
        },
        adjustments: {
          include: {
            claimLineItem: {
              select: {
                cptCode: true,
                serviceDate: true,
              },
            },
            createdBy: {
              select: {
                formalName: true,
                jobTitle: true,
              },
            },
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

  // Payment Allocation Methods
  async createPaymentAllocation(paymentId: string, claimLineItemId: string, allocatedAmount: number, allocationType?: string) {
    return this.prisma.paymentAllocation.create({
      data: {
        paymentId,
        claimLineItemId,
        allocatedAmount,
        allocationType,
      },
      include: {
        payment: {
          select: {
            paymentNumber: true,
            paymentAmount: true,
          },
        },
        claimLineItem: {
          select: {
            cptCode: true,
            serviceDate: true,
            chargeAmount: true,
          },
        },
      },
    });
  }

  async updatePaymentAllocation(id: string, allocatedAmount: number, allocationType?: string) {
    return this.prisma.paymentAllocation.update({
      where: { id },
      data: {
        allocatedAmount,
        allocationType,
      },
      include: {
        payment: {
          select: {
            paymentNumber: true,
            paymentAmount: true,
          },
        },
        claimLineItem: {
          select: {
            cptCode: true,
            serviceDate: true,
            chargeAmount: true,
          },
        },
      },
    });
  }

  async deletePaymentAllocation(id: string) {
    return this.prisma.paymentAllocation.delete({
      where: { id },
    });
  }

  // Adjustment Methods
  async createAdjustment(
    claimLineItemId: string,
    sourceType: string,
    groupCode: string,
    reasonCode: string,
    amount: number,
    reasonText?: string,
    paymentId?: string,
    createdById?: string
  ) {
    return this.prisma.adjustment.create({
      data: {
        claimLineItemId,
        paymentId,
        sourceType,
        groupCode,
        reasonCode,
        amount,
        reasonText,
        createdById,
      },
      include: {
        claimLineItem: {
          select: {
            cptCode: true,
            serviceDate: true,
            chargeAmount: true,
          },
        },
        payment: {
          select: {
            paymentNumber: true,
            paymentAmount: true,
          },
        },
        createdBy: {
          select: {
            formalName: true,
            jobTitle: true,
          },
        },
      },
    });
  }

  async updateAdjustment(id: string, amount: number, reasonText?: string) {
    return this.prisma.adjustment.update({
      where: { id },
      data: {
        amount,
        reasonText,
      },
      include: {
        claimLineItem: {
          select: {
            cptCode: true,
            serviceDate: true,
            chargeAmount: true,
          },
        },
        payment: {
          select: {
            paymentNumber: true,
            paymentAmount: true,
          },
        },
        createdBy: {
          select: {
            formalName: true,
            jobTitle: true,
          },
        },
      },
    });
  }

  async deleteAdjustment(id: string) {
    return this.prisma.adjustment.delete({
      where: { id },
    });
  }
} 