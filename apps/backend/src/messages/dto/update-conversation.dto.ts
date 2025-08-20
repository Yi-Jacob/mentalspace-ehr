import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ConversationPriority, ConversationCategory } from './shared-enums';

export class UpdateConversationDto {
  @IsOptional()
  @IsEnum(ConversationPriority)
  priority?: ConversationPriority;

  @IsOptional()
  @IsEnum(ConversationCategory)
  category?: ConversationCategory;

  @IsOptional()
  @IsString()
  title?: string;
}
