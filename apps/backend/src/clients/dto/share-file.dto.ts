import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class ShareFileDto {
  @IsString()
  @IsNotEmpty()
  fileId: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
