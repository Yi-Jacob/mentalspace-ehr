import { IsString, IsOptional, IsEnum, IsArray, IsUUID } from 'class-validator';
import { ConversationCategory, ConversationPriority } from './shared-enums';

export class CreateGroupConversationDto {
  @IsString()
  title: string;

  @IsArray()
  @IsUUID(undefined, { each: true })
  participantIds: string[];

  @IsOptional()
  @IsEnum(ConversationCategory)
  category?: ConversationCategory;

  @IsOptional()
  @IsEnum(ConversationPriority)
  priority?: ConversationPriority;
}
