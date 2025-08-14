import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateRecurringRuleDto } from './dto';

@Injectable()
export class RecurringRuleService {
  constructor(private prisma: PrismaService) {}

  async createRecurringRule(createRecurringRuleDto: CreateRecurringRuleDto) {
    return this.prisma.recurringRule.create({
      data: {
        recurringPattern: createRecurringRuleDto.recurringPattern,
        startDate: new Date(createRecurringRuleDto.startDate),
        endDate: createRecurringRuleDto.endDate ? new Date(createRecurringRuleDto.endDate) : null,
        timeSlots: createRecurringRuleDto.timeSlots,
        isBusinessDayOnly: createRecurringRuleDto.isBusinessDayOnly ?? true,
      },
    });
  }

  async findOne(id: string) {
    const recurringRule = await this.prisma.recurringRule.findUnique({
      where: { id },
    });

    if (!recurringRule) {
      throw new NotFoundException(`Recurring rule with ID ${id} not found`);
    }

    return recurringRule;
  }

  async update(id: string, updateData: Partial<CreateRecurringRuleDto>) {
    await this.findOne(id);

    const updatePayload: any = {};
    if (updateData.recurringPattern) updatePayload.recurringPattern = updateData.recurringPattern;
    if (updateData.startDate) updatePayload.startDate = new Date(updateData.startDate);
    if (updateData.endDate !== undefined) {
      updatePayload.endDate = updateData.endDate ? new Date(updateData.endDate) : null;
    }
    if (updateData.timeSlots) updatePayload.timeSlots = updateData.timeSlots;
    if (updateData.isBusinessDayOnly !== undefined) updatePayload.isBusinessDayOnly = updateData.isBusinessDayOnly;

    return this.prisma.recurringRule.update({
      where: { id },
      data: updatePayload,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    
    await this.prisma.recurringRule.delete({
      where: { id },
    });

    return { message: 'Recurring rule deleted successfully' };
  }
}
