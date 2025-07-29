import { PartialType } from '@nestjs/mapped-types';
import { CreateComplianceDeadlineDto } from './create-compliance-deadline.dto';

export class UpdateComplianceDeadlineDto extends PartialType(CreateComplianceDeadlineDto) {} 