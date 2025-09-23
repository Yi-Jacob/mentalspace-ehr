import { PartialType } from '@nestjs/mapped-types';
import { CreateClientFileDto } from './create-client-file.dto';
import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateClientFileDto extends PartialType(CreateClientFileDto) {
  @IsOptional()
  @IsString()
  coSignedBy?: string;

  @IsOptional()
  @IsDateString()
  coSignedByDate?: string;

  @IsOptional()
  @IsDateString()
  completedDate?: string;
}
