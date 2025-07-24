import { PartialType } from '@nestjs/swagger';
import { CreateProductivityGoalDto } from './create-productivity-goal.dto';

export class UpdateProductivityGoalDto extends PartialType(CreateProductivityGoalDto) {} 