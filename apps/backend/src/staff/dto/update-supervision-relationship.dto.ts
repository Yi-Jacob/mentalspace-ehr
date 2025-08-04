import { PartialType } from '@nestjs/mapped-types';
import { CreateSupervisionRelationshipDto } from './create-supervision-relationship.dto';
import { IsOptional, IsString, IsEnum } from 'class-validator';

export class UpdateSupervisionRelationshipDto extends PartialType(CreateSupervisionRelationshipDto) {
  @IsOptional()
  @IsString()
  terminationNotes?: string;
} 