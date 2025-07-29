import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateQuickActionDto } from './dto';
import { QuickActionEntity } from './entities/quick-action.entity';

@Injectable()
export class QuickActionsService {
  constructor(private prisma: PrismaService) {}

  async createAction(createActionDto: CreateQuickActionDto, userId: string): Promise<QuickActionEntity> {
    const action = await this.prisma.quickAction.create({
      data: {
        userId,
        actionType: createActionDto.actionType,
        title: createActionDto.title,
        description: createActionDto.description,
        priority: createActionDto.priority,
        dueDate: createActionDto.dueDate ? new Date(createActionDto.dueDate) : null,
        completed: false,
      },
    });

    return this.mapToEntity(action);
  }

  async findUserActions(userId: string): Promise<QuickActionEntity[]> {
    const actions = await this.prisma.quickAction.findMany({
      where: { 
        userId,
        completed: false 
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'asc' }
      ],
    });

    return actions.map(action => this.mapToEntity(action));
  }

  async completeAction(id: string): Promise<QuickActionEntity> {
    const action = await this.prisma.quickAction.update({
      where: { id },
      data: {
        completed: true,
        completedAt: new Date(),
      },
    });

    return this.mapToEntity(action);
  }

  async deleteAction(id: string): Promise<void> {
    await this.prisma.quickAction.delete({
      where: { id },
    });
  }

  private mapToEntity(action: any): QuickActionEntity {
    return {
      id: action.id,
      userId: action.userId,
      actionType: action.actionType,
      title: action.title,
      description: action.description,
      priority: action.priority,
      dueDate: action.dueDate,
      completed: action.completed,
      completedAt: action.completedAt,
      createdAt: action.createdAt,
    };
  }
} 