import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreatePayerDto } from './dto/create-payer.dto';
import { UpdatePayerDto } from './dto/update-payer.dto';

@Injectable()
export class PayerService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllPayers(status?: string, providerId?: string) {
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (providerId) {
      where.id = providerId;
    }

    return this.prisma.payer.findMany({
      where,
      orderBy: {
        name: 'asc',
      },
    });
  }

  async getPayerById(id: string) {
    const payer = await this.prisma.payer.findUnique({
      where: { id },
    });

    if (!payer) {
      throw new NotFoundException(`Payer with ID ${id} not found`);
    }

    return payer;
  }

  async createPayer(createPayerDto: CreatePayerDto) {
    return this.prisma.payer.create({
      data: createPayerDto,
    });
  }

  async updatePayer(id: string, updatePayerDto: UpdatePayerDto) {
    const payer = await this.getPayerById(id);

    return this.prisma.payer.update({
      where: { id },
      data: updatePayerDto,
    });
  }

  async deletePayer(id: string) {
    const payer = await this.getPayerById(id);

    return this.prisma.payer.delete({
      where: { id },
    });
  }
} 