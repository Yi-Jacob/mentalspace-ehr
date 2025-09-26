import { IsString, IsNotEmpty, IsOptional, IsInt, IsBoolean } from 'class-validator';
import { FileStatus } from '../enums/file-status.enum';

export class CreateClientFileDto {
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsString()
  @IsNotEmpty()
  fileId: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  status?: FileStatus;

  @IsString()
  @IsOptional()
  createdBy: string;
}
