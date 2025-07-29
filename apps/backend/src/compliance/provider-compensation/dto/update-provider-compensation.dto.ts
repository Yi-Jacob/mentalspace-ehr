import { PartialType } from '@nestjs/mapped-types';
import { CreateProviderCompensationDto } from './create-provider-compensation.dto';

export class UpdateProviderCompensationDto extends PartialType(CreateProviderCompensationDto) {} 