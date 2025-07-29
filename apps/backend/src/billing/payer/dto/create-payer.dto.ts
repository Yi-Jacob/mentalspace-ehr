import { IsString, IsOptional, IsBoolean, IsEmail } from 'class-validator';

export class CreatePayerDto {
  @IsString()
  name: string;

  @IsString()
  payerType: string;

  @IsOptional()
  @IsString()
  electronicPayerId?: string;

  @IsOptional()
  @IsString()
  addressLine1?: string;

  @IsOptional()
  @IsString()
  addressLine2?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  faxNumber?: string;

  @IsOptional()
  @IsString()
  contactPerson?: string;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsBoolean()
  requiresAuthorization?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
} 