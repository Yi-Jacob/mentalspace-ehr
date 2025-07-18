import { IsString, IsEmail, IsOptional, IsDateString, IsPhoneNumber, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ClientStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
}

export class CreateClientDto {
  @ApiProperty({ description: 'First name of the client' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Last name of the client' })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({ description: 'Email address of the client' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Phone number of the client' })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiPropertyOptional({ description: 'Date of birth of the client' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ description: 'Address of the client' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Status of the client' })
  @IsOptional()
  @IsEnum(ClientStatus)
  status?: ClientStatus = ClientStatus.ACTIVE;

  @ApiPropertyOptional({ description: 'Additional notes about the client' })
  @IsOptional()
  @IsString()
  notes?: string;
} 