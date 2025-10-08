import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class SharePortalFormDto {
  @IsString()
  @IsNotEmpty()
  portalFormId: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
