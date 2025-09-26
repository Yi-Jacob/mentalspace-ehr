import { IsString, IsOptional, IsBoolean, IsInt, IsEnum } from 'class-validator';

export enum SharableType {
  SHARABLE = 'sharable',
  NOT_SHARABLE = 'not_sharable',
}

export enum AccessLevel {
  ADMIN = 'admin',
  CLINICIAN = 'clinician',
  BILLING = 'billing',
}

export class CreateFileDto {
  @IsString()
  fileName: string;

  @IsString()
  fileUrl: string;

  @IsOptional()
  @IsInt()
  fileSize?: number;

  @IsOptional()
  @IsString()
  mimeType?: string;

  @IsOptional()
  @IsEnum(SharableType)
  sharable?: SharableType;

  @IsOptional()
  @IsEnum(AccessLevel)
  accessLevel?: AccessLevel;

  @IsOptional()
  @IsBoolean()
  isForPatient?: boolean;

  @IsOptional()
  @IsBoolean()
  isForStaff?: boolean;

  @IsOptional()
  @IsString()
  clientId?: string;

  @IsOptional()
  @IsString()
  userId?: string;
}
