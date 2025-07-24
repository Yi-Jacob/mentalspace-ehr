import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum MessagePriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

export class CreateMessageDto {
  @IsString()
  conversationId: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsEnum(MessagePriority)
  priority?: MessagePriority;

  @IsOptional()
  @IsString()
  messageType?: string;
} 