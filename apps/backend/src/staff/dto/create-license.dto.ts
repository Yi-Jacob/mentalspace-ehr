import { IsString, IsDateString, IsOptional, IsUUID } from 'class-validator';

export class CreateLicenseDto {
  @IsUUID()
  staffId: string;

  @IsString()
  licenseType: string;

  @IsString()
  licenseNumber: string;

  @IsDateString()
  licenseExpirationDate: string;

  @IsString()
  licenseStatus: string;

  @IsString()
  licenseState: string;

  @IsString()
  issuedBy: string;
} 