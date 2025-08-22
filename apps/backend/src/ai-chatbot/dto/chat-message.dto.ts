import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system'
}

export class ChatMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(MessageRole)
  role: MessageRole;

  @IsOptional()
  @IsString()
  timestamp?: string;
}

export class NoteContextDto {
  @IsString()
  @IsNotEmpty()
  noteId: string;

  @IsString()
  @IsNotEmpty()
  noteType: string;

  @IsString()
  @IsNotEmpty()
  clientName: string;

  @IsString()
  @IsNotEmpty()
  noteContent: string;
}

export class ChatRequestDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsString()
  sessionId?: string;

  @IsOptional()
  noteContext?: NoteContextDto;
}

export class ChatResponseDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  sessionId: string;

  @IsOptional()
  @IsString()
  error?: string;
}
