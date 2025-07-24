import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateProductivityGoalDto {
  @IsString()
  @IsNotEmpty()
  goalType: string;

  @IsNumber()
  targetValue: number;

  @IsOptional()
  @IsNumber()
  currentValue?: number;

  @IsOptional()
  @IsDateString()
  date?: string;
} 