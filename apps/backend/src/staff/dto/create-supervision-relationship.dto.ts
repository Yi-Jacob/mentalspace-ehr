import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';

export class CreateSupervisionRelationshipDto {
  @IsString()
  supervisorId: string;

  @IsString()
  superviseeId: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsEnum(['active', 'inactive', 'completed'])
  status?: string = 'active';
} 