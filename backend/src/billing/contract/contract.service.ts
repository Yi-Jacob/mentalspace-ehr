import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

@Injectable()
export class ContractService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllContracts(payerId?: string) {
    const where = payerId ? { payerId } : {};

    return this.prisma.payerContract.findMany({
      where,
      include: {
        payer: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        effectiveDate: 'desc',
      },
    });
  }

  async getContractById(id: string) {
    const contract = await this.prisma.payerContract.findUnique({
      where: { id },
      include: {
        payer: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!contract) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }

    return contract;
  }

  async createContract(createContractDto: CreateContractDto) {
    return this.prisma.payerContract.create({
      data: {
        ...createContractDto,
        effectiveDate: new Date(createContractDto.effectiveDate),
        expirationDate: createContractDto.expirationDate ? new Date(createContractDto.expirationDate) : null,
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

  async updateContract(id: string, updateContractDto: UpdateContractDto) {
    const contract = await this.getContractById(id);

    const data: any = { ...updateContractDto };
    if (updateContractDto.effectiveDate) {
      data.effectiveDate = new Date(updateContractDto.effectiveDate);
    }
    if (updateContractDto.expirationDate) {
      data.expirationDate = new Date(updateContractDto.expirationDate);
    }

    return this.prisma.payerContract.update({
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

  async deleteContract(id: string) {
    const contract = await this.getContractById(id);

    return this.prisma.payerContract.delete({
      where: { id },
    });
  }
} 