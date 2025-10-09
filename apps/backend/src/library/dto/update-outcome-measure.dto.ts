import { IsString, IsOptional, IsObject, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OutcomeMeasureContentDto } from './create-outcome-measure.dto';

export class UpdateOutcomeMeasureDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  sharable?: 'sharable' | 'not_sharable';

  @IsOptional()
  @IsString()
  accessLevel?: 'admin' | 'clinician' | 'billing';

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => OutcomeMeasureContentDto)
  content?: OutcomeMeasureContentDto;
}
