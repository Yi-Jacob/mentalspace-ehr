import { Injectable, Logger, ConflictException } from '@nestjs/common';
import { ClientsRepository } from '../repositories/clients.repository';
import { ClientsValidationService } from './clients-validation.service';
import { ClientsEventService } from './clients-event.service';
import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';
import { QueryClientDto } from '../dto/query-client.dto';
import { Client } from '../entities/client.entity';

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);

  constructor(
    private readonly clientsRepository: ClientsRepository,
    private readonly validationService: ClientsValidationService,
    private readonly eventService: ClientsEventService,
  ) {}

  async create(createClientDto: CreateClientDto, userId: string): Promise<Client> {
    this.logger.log(`Creating new client: ${createClientDto.firstName} ${createClientDto.lastName}`);

    // Validate business rules
    await this.validationService.validateCreate(createClientDto);

    // Check for duplicate email
    if (createClientDto.email) {
      const existingClient = await this.clientsRepository.findByEmail(createClientDto.email);
      if (existingClient) {
        throw new ConflictException('A client with this email already exists');
      }
    }

    // Create client
    const client = await this.clientsRepository.create(createClientDto, userId);

    // Emit events
    await this.eventService.clientCreated(client, userId);

    this.logger.log(`Client created successfully with ID: ${client.id}`);
    return client;
  }

  async findAll(query: QueryClientDto): Promise<{ clients: Client[]; total: number }> {
    this.logger.log(`Fetching clients with query: ${JSON.stringify(query)}`);

    const result = await this.clientsRepository.findAll(query);

    this.logger.log(`Found ${result.clients.length} clients out of ${result.total} total`);
    return result;
  }

  async findOne(id: string): Promise<Client> {
    this.logger.log(`Fetching client with ID: ${id}`);

    const client = await this.clientsRepository.findOne(id);

    this.logger.log(`Client found: ${client.fullName}`);
    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto, userId: string): Promise<Client> {
    this.logger.log(`Updating client with ID: ${id}`);

    // Validate business rules
    await this.validationService.validateUpdate(id, updateClientDto);

    // Check for duplicate email if email is being updated
    if (updateClientDto.email) {
      const existingClient = await this.clientsRepository.findByEmail(updateClientDto.email);
      if (existingClient && existingClient.id !== id) {
        throw new ConflictException('A client with this email already exists');
      }
    }

    // Update client
    const client = await this.clientsRepository.update(id, updateClientDto, userId);

    // Emit events
    await this.eventService.clientUpdated(client, userId);

    this.logger.log(`Client updated successfully: ${client.fullName}`);
    return client;
  }

  async remove(id: string, userId: string): Promise<void> {
    this.logger.log(`Removing client with ID: ${id}`);

    // Get client before deletion for event emission
    const client = await this.clientsRepository.findOne(id);

    // Soft delete client
    await this.clientsRepository.remove(id);

    // Emit events
    await this.eventService.clientDeleted(client, userId);

    this.logger.log(`Client removed successfully: ${client.fullName}`);
  }

  async findByEmail(email: string): Promise<Client | null> {
    this.logger.log(`Finding client by email: ${email}`);

    const client = await this.clientsRepository.findByEmail(email);

    if (client) {
      this.logger.log(`Client found by email: ${client.fullName}`);
    } else {
      this.logger.log(`No client found with email: ${email}`);
    }

    return client;
  }
} 