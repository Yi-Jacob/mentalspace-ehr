import { IsString, IsEmail, IsOptional, IsDateString, IsBoolean, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum Timezone {
  NOT_SET = 'Not Set',
  HAST = 'HAST',
  HAT = 'HAT',
  MART = 'MART',
  AKT = 'AKT',
  GAMT = 'GAMT',
  PT = 'PT',
  PST = 'PST',
  MT = 'MT',
  ART = 'ART',
  CT = 'CT',
  CST = 'CST',
  ET = 'ET',
  EST = 'EST',
  AT = 'AT',
  AST = 'AST',
  NT = 'NT',
  EGT_EGST = 'EGT/EGST',
  CVT = 'CVT',
}

export enum AppointmentReminders {
  DEFAULT_PRACTICE_SETTING = 'Default Practice Setting',
  NO_REMINDERS = 'No reminders',
  EMAIL_ONLY = 'Email only',
  TEXT_SMS_ONLY = 'Text (SMS) only',
  TEXT_SMS_AND_EMAIL = 'Text (SMS) and Email',
  TEXT_OR_CALL_AND_EMAIL = 'Text or Call, and Email',
}

export enum PCPRelease {
  NOT_SET = 'Not set',
  PATIENT_CONSENTED = 'Patient consented to release information',
  PATIENT_DECLINED = 'Patient declined to release information',
  NOT_APPLICABLE = 'Not applicable',
}

export class CreateClientDto {
  // Basic Info
  @ApiProperty({ description: 'First name of the client' })
  @IsString()
  firstName: string;

  @ApiPropertyOptional({ description: 'Middle name of the client' })
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiProperty({ description: 'Last name of the client' })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({ description: 'Suffix of the client' })
  @IsOptional()
  @IsString()
  suffix?: string;

  @ApiPropertyOptional({ description: 'Preferred name of the client' })
  @IsOptional()
  @IsString()
  preferredName?: string;

  @ApiPropertyOptional({ description: 'Pronouns of the client' })
  @IsOptional()
  @IsString()
  pronouns?: string;

  @ApiPropertyOptional({ description: 'Date of birth of the client' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ description: 'Assigned clinician ID' })
  @IsOptional()
  @IsString()
  assignedClinicianId?: string;

  // Contact Info
  @ApiPropertyOptional({ description: 'Email address of the client' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Address line 1' })
  @IsOptional()
  @IsString()
  address1?: string;

  @ApiPropertyOptional({ description: 'Address line 2' })
  @IsOptional()
  @IsString()
  address2?: string;

  @ApiPropertyOptional({ description: 'City' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'State' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ description: 'ZIP code' })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiPropertyOptional({ description: 'Timezone', enum: Timezone })
  @IsOptional()
  @IsEnum(Timezone)
  timezone?: Timezone = Timezone.NOT_SET;

  // Demographics
  @ApiPropertyOptional({ description: 'Administrative sex' })
  @IsOptional()
  @IsString()
  administrativeSex?: string;

  @ApiPropertyOptional({ description: 'Gender identity' })
  @IsOptional()
  @IsString()
  genderIdentity?: string;

  @ApiPropertyOptional({ description: 'Sexual orientation' })
  @IsOptional()
  @IsString()
  sexualOrientation?: string;

  @ApiPropertyOptional({ description: 'Race' })
  @IsOptional()
  @IsString()
  race?: string;

  @ApiPropertyOptional({ description: 'Ethnicity' })
  @IsOptional()
  @IsString()
  ethnicity?: string;

  @ApiPropertyOptional({ description: 'Languages' })
  @IsOptional()
  @IsString()
  languages?: string;

  @ApiPropertyOptional({ description: 'Marital status' })
  @IsOptional()
  @IsString()
  maritalStatus?: string;

  @ApiPropertyOptional({ description: 'Employment status' })
  @IsOptional()
  @IsString()
  employmentStatus?: string;

  @ApiPropertyOptional({ description: 'Religious affiliation' })
  @IsOptional()
  @IsString()
  religiousAffiliation?: string;

  @ApiPropertyOptional({ description: 'Smoking status' })
  @IsOptional()
  @IsString()
  smokingStatus?: string;

  // Settings
  @ApiPropertyOptional({ description: 'Appointment reminders', enum: AppointmentReminders })
  @IsOptional()
  @IsEnum(AppointmentReminders)
  appointmentReminders?: AppointmentReminders = AppointmentReminders.DEFAULT_PRACTICE_SETTING;

  @ApiPropertyOptional({ description: 'HIPAA signed' })
  @IsOptional()
  @IsBoolean()
  hipaaSigned?: boolean = false;

  @ApiPropertyOptional({ description: 'PCP release', enum: PCPRelease })
  @IsOptional()
  @IsEnum(PCPRelease)
  pcpRelease?: PCPRelease = PCPRelease.NOT_SET;

  @ApiPropertyOptional({ description: 'Patient comments' })
  @IsOptional()
  @IsString()
  patientComments?: string;

  // Status
  @ApiPropertyOptional({ description: 'Is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
} 