import { IsString, IsOptional, IsObject, IsEnum, IsBoolean } from 'class-validator';
import { NoteStatus } from './create-note.dto';

export class UpdateNoteDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsObject()
  content?: Record<string, any>;

  @IsOptional()
  @IsEnum(NoteStatus)
  status?: NoteStatus;

  @IsOptional()
  @IsBoolean()
  sign?: boolean;
} 