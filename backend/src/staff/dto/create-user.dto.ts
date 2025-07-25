import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsArray, IsBoolean, IsNumber, IsDateString, IsEnum, ValidateIf } from 'class-validator';

// Define UserStatus enum since it's not in the existing enum file
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export class CreateUserDto {
  // Basic user information
  @ApiProperty({ description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User first name' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'User last name' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'User middle name', required: false })
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiProperty({ description: 'User suffix', required: false })
  @IsOptional()
  @IsString()
  suffix?: string;

  @ApiProperty({ description: 'User avatar URL', required: false })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  // Contact information
  @ApiProperty({ description: 'User name', required: false })
  @IsOptional()
  @IsString()
  userName?: string;

  @ApiProperty({ description: 'Mobile phone', required: false })
  @IsOptional()
  @IsString()
  mobilePhone?: string;

  @ApiProperty({ description: 'Work phone', required: false })
  @IsOptional()
  @IsString()
  workPhone?: string;

  @ApiProperty({ description: 'Home phone', required: false })
  @IsOptional()
  @IsString()
  homePhone?: string;

  @ApiProperty({ description: 'Can receive text messages', required: false })
  @IsOptional()
  @IsBoolean()
  canReceiveText?: boolean;

  // Address information
  @ApiProperty({ description: 'Address line 1', required: false })
  @IsOptional()
  @IsString()
  address1?: string;

  @ApiProperty({ description: 'Address line 2', required: false })
  @IsOptional()
  @IsString()
  address2?: string;

  @ApiProperty({ description: 'City', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ description: 'State', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ description: 'Zip code', required: false })
  @IsOptional()
  @IsString()
  zipCode?: string;

  // Staff profile information
  @ApiProperty({ description: 'Employee ID', required: false })
  @IsOptional()
  @IsString()
  employeeId?: string;

  @ApiProperty({ description: 'Job title', required: false })
  @IsOptional()
  @IsString()
  jobTitle?: string;

  @ApiProperty({ description: 'Formal name', required: false })
  @IsOptional()
  @IsString()
  formalName?: string;

  @ApiProperty({ description: 'NPI number', required: false })
  @IsOptional()
  @IsString()
  npiNumber?: string;

  @ApiProperty({ description: 'Department', required: false })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({ description: 'Phone number', required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ description: 'License number', required: false })
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @ApiProperty({ description: 'License state', required: false })
  @IsOptional()
  @IsString()
  licenseState?: string;

  @ApiProperty({ description: 'License expiry date (ISO 8601 format)', required: false })
  @IsOptional()
  @ValidateIf((o) => o.licenseExpiryDate !== undefined && o.licenseExpiryDate !== null)
  @IsDateString({}, { message: 'licenseExpiryDate must be a valid ISO 8601 date string' })
  licenseExpiryDate?: string;

  @ApiProperty({ description: 'Hire date (ISO 8601 format)', required: false })
  @IsOptional()
  @ValidateIf((o) => o.hireDate !== undefined && o.hireDate !== null)
  @IsDateString({}, { message: 'hireDate must be a valid ISO 8601 date string' })
  hireDate?: string;

  @ApiProperty({ description: 'Billing rate', required: false })
  @IsOptional()
  @IsNumber()
  billingRate?: number;

  @ApiProperty({ description: 'Can bill insurance', required: false })
  @IsOptional()
  @IsBoolean()
  canBillInsurance?: boolean;

  @ApiProperty({ description: 'User status', required: false })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiProperty({ description: 'Notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  // Additional fields
  @ApiProperty({ description: 'Clinician type', required: false })
  @IsOptional()
  @IsString()
  clinicianType?: string;

  @ApiProperty({ description: 'Supervision type', required: false })
  @IsOptional()
  @IsString()
  supervisionType?: string;

  @ApiProperty({ description: 'Supervisor ID', required: false })
  @IsOptional()
  @IsString()
  supervisorId?: string;

  // User comments
  @ApiProperty({ description: 'User comments', required: false })
  @IsOptional()
  @IsString()
  userComments?: string;
} 