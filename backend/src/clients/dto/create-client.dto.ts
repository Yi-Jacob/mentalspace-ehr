import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsDateString, IsOptional, IsBoolean } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({ description: 'Client first name' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Client middle name', required: false })
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiProperty({ description: 'Client last name' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'Client suffix', required: false })
  @IsOptional()
  @IsString()
  suffix?: string;

  @ApiProperty({ description: 'Client preferred name', required: false })
  @IsOptional()
  @IsString()
  preferredName?: string;

  @ApiProperty({ description: 'Client pronouns', required: false })
  @IsOptional()
  @IsString()
  pronouns?: string;

  @ApiProperty({ description: 'Client date of birth' })
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty({ description: 'Client email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Client address line 1' })
  @IsString()
  address1: string;

  @ApiProperty({ description: 'Client address line 2', required: false })
  @IsOptional()
  @IsString()
  address2?: string;

  @ApiProperty({ description: 'Client city' })
  @IsString()
  city: string;

  @ApiProperty({ description: 'Client state' })
  @IsString()
  state: string;

  @ApiProperty({ description: 'Client zip code' })
  @IsString()
  zipCode: string;

  @ApiProperty({ description: 'Client timezone' })
  @IsString()
  timezone: string;

  @ApiProperty({ description: 'Client appointment reminders' })
  @IsString()
  appointmentReminders: string;

  @ApiProperty({ description: 'Client HIPAA signed status' })
  @IsBoolean()
  hipaaSigned: boolean;

  @ApiProperty({ description: 'Client PCP release' })
  @IsString()
  pcpRelease: string;

  @ApiProperty({ description: 'Client patient comments', required: false })
  @IsOptional()
  @IsString()
  patientComments?: string;

  @ApiProperty({ description: 'Assigned clinician ID', required: false })
  @IsOptional()
  @IsString()
  assignedClinicianId?: string;

  @ApiProperty({ description: 'Created by user ID', required: false })
  @IsOptional()
  @IsString()
  createdById?: string;
} 