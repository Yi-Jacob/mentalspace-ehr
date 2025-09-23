import { IsString, IsNotEmpty } from 'class-validator';

export class CompleteFileDto {
  @IsString()
  @IsNotEmpty()
  fileId: string;

  @IsString()
  @IsNotEmpty()
  completedBy: string;
}
