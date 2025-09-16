import { IsString, IsNotEmpty, IsOptional, IsObject, IsEnum } from 'class-validator';

export enum NoteType {
  INTAKE = 'intake',
  PROGRESS_NOTE = 'progress_note',
  TREATMENT_PLAN = 'treatment_plan',
  CONTACT_NOTE = 'contact_note',
  CONSULTATION_NOTE = 'consultation_note',
  CANCELLATION_NOTE = 'cancellation_note',
  MISCELLANEOUS_NOTE = 'miscellaneous_note',
}

export enum NoteStatus {
  DRAFT = 'draft',
  PENDING_CO_SIGN = 'pending_co_sign',
  ACCEPTED = 'accepted',
  LOCKED = 'locked',
}

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsObject()
  @IsNotEmpty()
  content: Record<string, any>;

  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsEnum(NoteType)
  noteType: NoteType;

  @IsOptional()
  @IsEnum(NoteStatus)
  status?: NoteStatus = NoteStatus.DRAFT;
} 