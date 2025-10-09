import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateNotificationDto {
  @IsUUID()
  receiverId: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  associatedLink?: string;
}
