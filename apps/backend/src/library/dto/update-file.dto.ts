import { IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { SharableType, AccessLevel } from './create-file.dto';

export class UpdateFileDto {
  @IsOptional()
  @IsString()
  fileName?: string;

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
