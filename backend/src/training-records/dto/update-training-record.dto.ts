import { PartialType } from '@nestjs/swagger';
import { CreateTrainingRecordDto } from './create-training-record.dto';

export class UpdateTrainingRecordDto extends PartialType(CreateTrainingRecordDto) {} 