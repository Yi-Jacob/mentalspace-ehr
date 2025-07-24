import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateFeeScheduleDto } from './dto/create-fee-schedule.dto';
import { UpdateFeeScheduleDto } from './dto/update-fee-schedule.dto';

@Injectable()
export class FeeScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllFeeSchedules(payerId?: string) {
    const where = payerId ? { 
      payerId,
      isActive: true,
    } : { isActive: true };

    return this.prisma.payerFeeSchedule.findMany({
      where,
      include: {
        payer: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        cptCode: 'asc',
      },
    });
  }

  async getFeeScheduleById(id: string) {
    const feeSchedule = await this.prisma.payerFeeSchedule.findUnique({
      where: { id },
      include: {
        payer: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!feeSchedule) {
      throw new NotFoundException(`Fee schedule with ID ${id} not found`);
    }

    return feeSchedule;
  }

  async createFeeSchedule(createFeeScheduleDto: CreateFeeScheduleDto) {
    return this.prisma.payerFeeSchedule.create({
      data: {
        ...createFeeScheduleDto,
        effectiveDate: new Date(createFeeScheduleDto.effectiveDate),
        expirationDate: createFeeScheduleDto.expirationDate ? new Date(createFeeScheduleDto.expirationDate) : null,
      },
      include: {
        payer: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async updateFeeSchedule(id: string, updateFeeScheduleDto: UpdateFeeScheduleDto) {
    const feeSchedule = await this.getFeeScheduleById(id);

    const data: any = { ...updateFeeScheduleDto };
    if (updateFeeScheduleDto.effectiveDate) {
      data.effectiveDate = new Date(updateFeeScheduleDto.effectiveDate);
    }
    if (updateFeeScheduleDto.expirationDate) {
      data.expirationDate = new Date(updateFeeScheduleDto.expirationDate);
    }

    return this.prisma.payerFeeSchedule.update({
      where: { id },
      data,
      include: {
        payer: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async deleteFeeSchedule(id: string) {
    const feeSchedule = await this.getFeeScheduleById(id);

    // Soft delete by setting isActive to false
    return this.prisma.payerFeeSchedule.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getCptCodes() {
    return this.prisma.cptCode.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        code: 'asc',
      },
    });
  }
} 