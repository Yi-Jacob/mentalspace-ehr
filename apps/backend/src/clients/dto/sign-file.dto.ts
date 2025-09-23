import { IsString, IsNotEmpty } from 'class-validator';

export class SignFileDto {
  @IsString()
  @IsNotEmpty()
  fileId: string;

  @IsString()
  @IsNotEmpty()
  signedBy: string;
}
