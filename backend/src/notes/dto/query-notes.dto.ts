import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { NoteType, NoteStatus } from './create-note.dto';

export class QueryNotesDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  limit?: number = 10;

  @IsOptional()
  @IsString()
  clientId?: string;

  @IsOptional()
  @IsEnum(NoteType)
  noteType?: NoteType;

  @IsOptional()
  @IsEnum(NoteStatus)
  status?: NoteStatus;
} 