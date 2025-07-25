import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateProviderCompensationDto } from './dto/create-provider-compensation.dto';
import { UpdateProviderCompensationDto } from './dto/update-provider-compensation.dto';

@Injectable()
export class ProviderCompensationService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllProviderCompensations(providerId?: string) {
    const where: any = {};

    if (providerId) {
      where.providerId = providerId;
    }

    return this.prisma.providerCompensationConfig.findMany({
      where,
      include: {
        provider: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        createdByUser: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getProviderCompensationById(id: string) {
    const compensation = await this.prisma.providerCompensationConfig.findUnique({
      where: { id },
      include: {
        provider: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        createdByUser: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!compensation) {
      throw new NotFoundException(`Provider compensation with ID ${id} not found`);
    }

    return compensation;
  }

  async createProviderCompensation(createProviderCompensationDto: CreateProviderCompensationDto) {
    const data: any = {
      ...createProviderCompensationDto,
      effectiveDate: new Date(createProviderCompensationDto.effectiveDate),
    };

    if (createProviderCompensationDto.expirationDate) {
      data.expirationDate = new Date(createProviderCompensationDto.expirationDate);
    }

    return this.prisma.providerCompensationConfig.create({
      data,
      include: {
        provider: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        createdByUser: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async updateProviderCompensation(id: string, updateProviderCompensationDto: UpdateProviderCompensationDto) {
    const compensation = await this.getProviderCompensationById(id);

    const data: any = { ...updateProviderCompensationDto };

    if (updateProviderCompensationDto.effectiveDate) {
      data.effectiveDate = new Date(updateProviderCompensationDto.effectiveDate);
    }
    if (updateProviderCompensationDto.expirationDate) {
      data.expirationDate = new Date(updateProviderCompensationDto.expirationDate);
    }

    return this.prisma.providerCompensationConfig.update({
      where: { id },
      data,
      include: {
        provider: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        createdByUser: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async deleteProviderCompensation(id: string) {
    const compensation = await this.getProviderCompensationById(id);

    return this.prisma.providerCompensationConfig.delete({
      where: { id },
    });
  }

  async getSessionMultipliers(providerId?: string) {
    const where: any = {};

    if (providerId) {
      where.providerId = providerId;
    }

    return this.prisma.sessionRateMultiplier.findMany({
      where,
      orderBy: {
        sessionType: 'asc',
      },
    });
  }
} 