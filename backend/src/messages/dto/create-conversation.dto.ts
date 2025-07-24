import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum ConversationCategory {
  CLINICAL = 'clinical',
  ADMINISTRATIVE = 'administrative',
  URGENT = 'urgent',
  GENERAL = 'general',
}

export enum ConversationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

export class CreateConversationDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsString()
  clientId: string;

  @IsOptional()
  @IsEnum(ConversationCategory)
  category?: ConversationCategory;

  @IsOptional()
  @IsEnum(ConversationPriority)
  priority?: ConversationPriority;
} 