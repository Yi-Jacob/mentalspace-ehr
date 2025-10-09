import { IsString, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class QuestionResponseDto {
  @IsString()
  questionId: string;

  @IsArray()
  @IsString({ each: true })
  selectedOptions: string[];

  @IsNumber()
  score: number;
}

export class SubmitOutcomeMeasureResponseDto {
  @IsString()
  clientFileId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionResponseDto)
  responses: QuestionResponseDto[];
}
