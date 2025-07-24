import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateProductivityGoalDto, UpdateProductivityGoalDto } from './dto';
import { ProductivityGoalEntity } from './entities/productivity-goal.entity';

@Injectable()
export class ProductivityGoalsService {
  constructor(private prisma: PrismaService) {}

  async createGoal(createGoalDto: CreateProductivityGoalDto, userId: string): Promise<ProductivityGoalEntity> {
    const goal = await this.prisma.productivityGoal.create({
      data: {
        userId,
        goalType: createGoalDto.goalType,
        targetValue: createGoalDto.targetValue,
        currentValue: createGoalDto.currentValue || 0,
        date: createGoalDto.date ? new Date(createGoalDto.date) : new Date(),
      },
    });

    return this.mapToEntity(goal);
  }

  async findAll(userId: string, date?: string): Promise<ProductivityGoalEntity[]> {
    const where: any = { userId };
    
    if (date) {
      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
      const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
      
      where.date = {
        gte: startOfDay,
        lt: endOfDay,
      };
    }

    const goals = await this.prisma.productivityGoal.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return goals.map(goal => this.mapToEntity(goal));
  }

  async findOne(id: string): Promise<ProductivityGoalEntity> {
    const goal = await this.prisma.productivityGoal.findUnique({
      where: { id },
    });

    if (!goal) {
      throw new NotFoundException(`Productivity goal with ID ${id} not found`);
    }

    return this.mapToEntity(goal);
  }

  async updateGoal(id: string, updateGoalDto: UpdateProductivityGoalDto): Promise<ProductivityGoalEntity> {
    const goal = await this.prisma.productivityGoal.update({
      where: { id },
      data: {
        ...(updateGoalDto.goalType && { goalType: updateGoalDto.goalType }),
        ...(updateGoalDto.targetValue !== undefined && { targetValue: updateGoalDto.targetValue }),
        ...(updateGoalDto.currentValue !== undefined && { currentValue: updateGoalDto.currentValue }),
        ...(updateGoalDto.date && { date: new Date(updateGoalDto.date) }),
      },
    });

    return this.mapToEntity(goal);
  }

  async deleteGoal(id: string): Promise<void> {
    await this.prisma.productivityGoal.delete({
      where: { id },
    });
  }

  private mapToEntity(goal: any): ProductivityGoalEntity {
    return {
      id: goal.id,
      userId: goal.userId,
      goalType: goal.goalType,
      targetValue: goal.targetValue,
      currentValue: goal.currentValue,
      date: goal.date,
      createdAt: goal.createdAt,
      updatedAt: goal.updatedAt,
    };
  }
} 