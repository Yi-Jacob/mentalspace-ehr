import { ApiProperty } from '@nestjs/swagger';

export class Client {
  @ApiProperty({ description: 'Unique identifier for the client' })
  id: string;

  @ApiProperty({ description: 'First name of the client' })
  firstName: string;

  @ApiProperty({ description: 'Last name of the client' })
  lastName: string;

  @ApiProperty({ description: 'Email address of the client' })
  email?: string;

  @ApiProperty({ description: 'Phone number of the client' })
  phone?: string;

  @ApiProperty({ description: 'Date of birth of the client' })
  dateOfBirth?: Date;

  @ApiProperty({ description: 'Address of the client' })
  address?: string;

  @ApiProperty({ description: 'Status of the client' })
  status: string;

  @ApiProperty({ description: 'Additional notes about the client' })
  notes?: string;

  @ApiProperty({ description: 'Date when the client was created' })
  createdAt: Date;

  @ApiProperty({ description: 'Date when the client was last updated' })
  updatedAt: Date;

  @ApiProperty({ description: 'Full name of the client' })
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
} 