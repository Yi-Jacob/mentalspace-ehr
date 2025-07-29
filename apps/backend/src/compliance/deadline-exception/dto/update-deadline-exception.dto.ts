import { PartialType } from '@nestjs/mapped-types';
import { CreateDeadlineExceptionDto } from './create-deadline-exception.dto';

export class UpdateDeadlineExceptionDto extends PartialType(CreateDeadlineExceptionDto) {} 