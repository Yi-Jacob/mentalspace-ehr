import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';

export enum MessagePriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

export class CreateMessageDto {
  @IsString()
  @IsUUID()
  conversationId: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsEnum(MessagePriority)
  priority?: MessagePriority;

  @IsOptional()
  @IsString()
  messageType?: string;

  @IsOptional()
  @IsUUID()
  replyToId?: string;
} 