import { IsString, IsOptional, IsObject, IsArray, ValidateNested, IsBoolean, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class OutcomeOptionDto {
  @IsString()
  id: string;

  @IsString()
  text: string;

  @IsNumber()
  @Min(0)
  score: number;
}

export class ScaleConfigDto {
  @IsNumber()
  minValue: number;

  @IsNumber()
  maxValue: number;

  @IsNumber()
  step: number;

  @IsOptional()
  @IsString()
  minLabel?: string;

  @IsOptional()
  @IsString()
  maxLabel?: string;
}

export class OutcomeQuestionDto {
  @IsString()
  id: string;

  @IsString()
  question: string;

  @IsString()
  type: 'single_choice' | 'multiple_choice' | 'scale';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OutcomeOptionDto)
  options: OutcomeOptionDto[];

  @IsBoolean()
  required: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => ScaleConfigDto)
  scaleConfig?: ScaleConfigDto;
}

export class ScoringCriterionDto {
  @IsString()
  id: string;

  @IsNumber()
  @Min(0)
  minScore: number;

  @IsNumber()
  @Min(0)
  maxScore: number;

  @IsString()
  label: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  color?: string;
}

export class OutcomeMeasureContentDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OutcomeQuestionDto)
  questions: OutcomeQuestionDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScoringCriterionDto)
  scoringCriteria: ScoringCriterionDto[];
}

export class CreateOutcomeMeasureDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  sharable?: 'sharable' | 'not_sharable';

  @IsOptional()
  @IsString()
  accessLevel?: 'admin' | 'clinician' | 'billing';

  @IsObject()
  @ValidateNested()
  @Type(() => OutcomeMeasureContentDto)
  content: OutcomeMeasureContentDto;
}
