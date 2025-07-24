import { PartialType } from '@nestjs/mapped-types';
import { CreateFeeScheduleDto } from './create-fee-schedule.dto';

export class UpdateFeeScheduleDto extends PartialType(CreateFeeScheduleDto) {} 