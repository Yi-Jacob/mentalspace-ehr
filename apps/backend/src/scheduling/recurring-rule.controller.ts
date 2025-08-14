import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RecurringRuleService } from './recurring-rule.service';
import { CreateRecurringRuleDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('scheduling/recurring-rules')
@UseGuards(JwtAuthGuard)
export class RecurringRuleController {
  constructor(private readonly recurringRuleService: RecurringRuleService) {}

  @Post()
  createRecurringRule(@Body() createRecurringRuleDto: CreateRecurringRuleDto) {
    return this.recurringRuleService.createRecurringRule(createRecurringRuleDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recurringRuleService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRecurringRuleDto: Partial<CreateRecurringRuleDto>,
  ) {
    return this.recurringRuleService.update(id, updateRecurringRuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recurringRuleService.remove(id);
  }
}
