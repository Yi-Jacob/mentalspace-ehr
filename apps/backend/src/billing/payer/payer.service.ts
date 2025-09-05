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

    const payers = await this.prisma.payer.findMany({
      where,
      orderBy: {
        name: 'asc',
      },
    });

    return payers.map(payer => ({
      id: payer.id,
      name: payer.name,
      payerType: payer.payerType,
      electronicPayerId: payer.electronicPayerId,
      addressLine1: payer.addressLine1,
      addressLine2: payer.addressLine2,
      city: payer.city,
      state: payer.state,
      zipCode: payer.zipCode,
      phoneNumber: payer.phoneNumber,
      faxNumber: payer.faxNumber,
      contactPerson: payer.contactPerson,
      contactEmail: payer.contactEmail,
      website: payer.website,
      requiresAuthorization: payer.requiresAuthorization,
      notes: payer.notes,
      createdAt: payer.createdAt.toISOString(),
      updatedAt: payer.updatedAt.toISOString(),
    }));
  }

  async getPayerById(id: string) {
    const payer = await this.prisma.payer.findUnique({
      where: { id },
    });

    if (!payer) {
      throw new NotFoundException(`Payer with ID ${id} not found`);
    }

    return {
      id: payer.id,
      name: payer.name,
      payerType: payer.payerType,
      electronicPayerId: payer.electronicPayerId,
      addressLine1: payer.addressLine1,
      addressLine2: payer.addressLine2,
      city: payer.city,
      state: payer.state,
      zipCode: payer.zipCode,
      phoneNumber: payer.phoneNumber,
      faxNumber: payer.faxNumber,
      contactPerson: payer.contactPerson,
      contactEmail: payer.contactEmail,
      website: payer.website,
      requiresAuthorization: payer.requiresAuthorization,
      notes: payer.notes,
      createdAt: payer.createdAt.toISOString(),
      updatedAt: payer.updatedAt.toISOString(),
    };
  }

  async createPayer(createPayerDto: CreatePayerDto) {
    const payer = await this.prisma.payer.create({
      data: createPayerDto,
    });

    return {
      id: payer.id,
      name: payer.name,
      payerType: payer.payerType,
      electronicPayerId: payer.electronicPayerId,
      addressLine1: payer.addressLine1,
      addressLine2: payer.addressLine2,
      city: payer.city,
      state: payer.state,
      zipCode: payer.zipCode,
      phoneNumber: payer.phoneNumber,
      faxNumber: payer.faxNumber,
      contactPerson: payer.contactPerson,
      contactEmail: payer.contactEmail,
      website: payer.website,
      requiresAuthorization: payer.requiresAuthorization,
      notes: payer.notes,
      createdAt: payer.createdAt.toISOString(),
      updatedAt: payer.updatedAt.toISOString(),
    };
  }

  async updatePayer(id: string, updatePayerDto: UpdatePayerDto) {
    await this.getPayerById(id); // Check if payer exists

    const payer = await this.prisma.payer.update({
      where: { id },
      data: updatePayerDto,
    });

    return {
      id: payer.id,
      name: payer.name,
      payerType: payer.payerType,
      electronicPayerId: payer.electronicPayerId,
      addressLine1: payer.addressLine1,
      addressLine2: payer.addressLine2,
      city: payer.city,
      state: payer.state,
      zipCode: payer.zipCode,
      phoneNumber: payer.phoneNumber,
      faxNumber: payer.faxNumber,
      contactPerson: payer.contactPerson,
      contactEmail: payer.contactEmail,
      website: payer.website,
      requiresAuthorization: payer.requiresAuthorization,
      notes: payer.notes,
      createdAt: payer.createdAt.toISOString(),
      updatedAt: payer.updatedAt.toISOString(),
    };
  }

  async deletePayer(id: string) {
    const payer = await this.getPayerById(id);

    return this.prisma.payer.delete({
      where: { id },
    });
  }
} 