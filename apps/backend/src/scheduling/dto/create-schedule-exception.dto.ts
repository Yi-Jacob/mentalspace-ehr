import { IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class CreateScheduleExceptionDto {
  @IsDateString()
  exceptionDate: string;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsBoolean()
  isUnavailable?: boolean;

  @IsOptional()
  @IsString()
  reason?: string;
}
