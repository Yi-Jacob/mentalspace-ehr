import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';
import { QueryClientDto } from '../dto/query-client.dto';
import { Client } from '../entities/client.entity';

@Injectable()
export class ClientsRepository {
  private readonly logger = new Logger(ClientsRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createClientDto: CreateClientDto, userId: string): Promise<Client> {
    try {
      const client = await this.prisma.client.create({
        data: {
          ...createClientDto,
          createdBy: userId,
          isActive: true,
        },
      });

      this.logger.log(`Client created with ID: ${client.id}`);
      return this.mapToEntity(client);
    } catch (error) {
      this.logger.error(`Failed to create client: ${error.message}`);
      throw error;
    }
  }

  async findAll(query: QueryClientDto): Promise<{ clients: Client[]; total: number }> {
    try {
      const { search, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = query;
      const skip = (page - 1) * limit;

      const where = {
        isActive: true,
        ...(search && {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' as const } },
            { lastName: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }),
      };

      const [clients, total] = await Promise.all([
        this.prisma.client.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
        }),
        this.prisma.client.count({ where }),
      ]);

      return { 
        clients: clients.map(client => this.mapToEntity(client)), 
        total 
      };
    } catch (error) {
      this.logger.error(`Failed to fetch clients: ${error.message}`);
      throw error;
    }
  }

  async findOne(id: string): Promise<Client> {
    try {
      const client = await this.prisma.client.findUnique({
        where: { id },
      });

      if (!client) {
        throw new NotFoundException(`Client with ID ${id} not found`);
      }

      return this.mapToEntity(client);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to fetch client ${id}: ${error.message}`);
      throw error;
    }
  }

  async update(id: string, updateClientDto: UpdateClientDto, userId: string): Promise<Client> {
    try {
      const client = await this.prisma.client.update({
        where: { id },
        data: {
          ...updateClientDto,
        },
      });

      this.logger.log(`Client updated with ID: ${id}`);
      return this.mapToEntity(client);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Client with ID ${id} not found`);
      }
      this.logger.error(`Failed to update client ${id}: ${error.message}`);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.client.update({
        where: { id },
        data: { isActive: false },
      });

      this.logger.log(`Client soft deleted with ID: ${id}`);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Client with ID ${id} not found`);
      }
      this.logger.error(`Failed to delete client ${id}: ${error.message}`);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<Client | null> {
    try {
      const client = await this.prisma.client.findFirst({
        where: { email, isActive: true },
      });
      
      return client ? this.mapToEntity(client) : null;
    } catch (error) {
      this.logger.error(`Failed to find client by email ${email}: ${error.message}`);
      throw error;
    }
  }

  private mapToEntity(client: any): Client {
    return {
      id: client.id,
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phone: client.phone,
      dateOfBirth: client.dateOfBirth,
      address: client.address1,
      status: client.isActive ? 'ACTIVE' : 'INACTIVE',
      notes: client.patientComments,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
      fullName: `${client.firstName} ${client.lastName}`,
    };
  }
} 