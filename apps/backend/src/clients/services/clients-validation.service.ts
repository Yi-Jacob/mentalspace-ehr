import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';

@Injectable()
export class ClientsValidationService {
  private readonly logger = new Logger(ClientsValidationService.name);

  async validateCreate(createClientDto: CreateClientDto): Promise<void> {
    this.logger.log('Validating client creation');

    // Validate required fields
    if (!createClientDto.firstName?.trim()) {
      throw new BadRequestException('First name is required');
    }

    if (!createClientDto.lastName?.trim()) {
      throw new BadRequestException('Last name is required');
    }

    // Validate email format if provided
    if (createClientDto.email && !this.isValidEmail(createClientDto.email)) {
      throw new BadRequestException('Invalid email format');
    }

    // Validate date of birth if provided
    if (createClientDto.dateOfBirth) {
      const dob = new Date(createClientDto.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      
      if (age < 0 || age > 120) {
        throw new BadRequestException('Invalid date of birth');
      }
    }

    this.logger.log('Client creation validation passed');
  }

  async validateUpdate(id: string, updateClientDto: UpdateClientDto): Promise<void> {
    this.logger.log(`Validating client update for ID: ${id}`);

    // Validate email format if provided
    if (updateClientDto.email && !this.isValidEmail(updateClientDto.email)) {
      throw new BadRequestException('Invalid email format');
    }

    // Validate date of birth if provided
    if (updateClientDto.dateOfBirth) {
      const dob = new Date(updateClientDto.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      
      if (age < 0 || age > 120) {
        throw new BadRequestException('Invalid date of birth');
      }
    }

    // Validate name fields if provided
    if (updateClientDto.firstName !== undefined && !updateClientDto.firstName?.trim()) {
      throw new BadRequestException('First name cannot be empty');
    }

    if (updateClientDto.lastName !== undefined && !updateClientDto.lastName?.trim()) {
      throw new BadRequestException('Last name cannot be empty');
    }

    this.logger.log('Client update validation passed');
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
} 