import { IsString, IsDateString, IsOptional } from 'class-validator';

export class SessionAnalyticsDto {
  @IsString()
  providerId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}

export class ComplianceReportDto {
  @IsString()
  providerId: string;

  @IsDateString()
  weekStart: string;
}

export class PaymentCalculationDto {
  @IsString()
  providerId: string;

  @IsOptional()
  @IsDateString()
  payPeriodWeek?: string;
}
