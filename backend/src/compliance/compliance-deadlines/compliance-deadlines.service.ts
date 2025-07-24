import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateComplianceDeadlineDto } from './dto/create-compliance-deadline.dto';
import { UpdateComplianceDeadlineDto } from './dto/update-compliance-deadline.dto';

@Injectable()
export class ComplianceDeadlinesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllComplianceDeadlines(status?: string, providerId?: string) {
    const where: any = {};

    if (providerId) {
      where.providerId = providerId;
    }

    if (status) {
      const now = new Date();
      
      if (status === 'pending') {
        where.isMet = false;
        where.deadlineDate = {
          gte: now,
        };
      } else if (status === 'met') {
        where.isMet = true;
      } else if (status === 'overdue') {
        where.isMet = false;
        where.deadlineDate = {
          lt: now,
        };
      }
    }

    return this.prisma.complianceDeadline.findMany({
      where,
      include: {
        provider: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        deadlineDate: 'asc',
      },
    });
  }

  async getComplianceDeadlineById(id: string) {
    const deadline = await this.prisma.complianceDeadline.findUnique({
      where: { id },
      include: {
        provider: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!deadline) {
      throw new NotFoundException(`Compliance deadline with ID ${id} not found`);
    }

    return deadline;
  }

  async createComplianceDeadline(createComplianceDeadlineDto: CreateComplianceDeadlineDto) {
    const data: any = {
      ...createComplianceDeadlineDto,
      deadlineDate: new Date(createComplianceDeadlineDto.deadlineDate),
    };

    return this.prisma.complianceDeadline.create({
      data,
      include: {
        provider: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async updateComplianceDeadline(id: string, updateComplianceDeadlineDto: UpdateComplianceDeadlineDto) {
    const deadline = await this.getComplianceDeadlineById(id);

    const data: any = { ...updateComplianceDeadlineDto };

    if (updateComplianceDeadlineDto.deadlineDate) {
      data.deadlineDate = new Date(updateComplianceDeadlineDto.deadlineDate);
    }

    return this.prisma.complianceDeadline.update({
      where: { id },
      data,
      include: {
        provider: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async deleteComplianceDeadline(id: string) {
    const deadline = await this.getComplianceDeadlineById(id);

    return this.prisma.complianceDeadline.delete({
      where: { id },
    });
  }

  async markDeadlineAsMet(id: string) {
    const deadline = await this.getComplianceDeadlineById(id);

    return this.prisma.complianceDeadline.update({
      where: { id },
      data: {
        isMet: true,
      },
      include: {
        provider: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async sendReminders() {
    const now = new Date();
    const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const fortyEightHoursFromNow = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    const seventyTwoHoursFromNow = new Date(now.getTime() + 72 * 60 * 60 * 1000);

    // Get deadlines that need reminders
    const deadlinesNeedingReminders = await this.prisma.complianceDeadline.findMany({
      where: {
        isMet: false,
        deadlineDate: {
          gte: now,
          lte: seventyTwoHoursFromNow,
        },
      },
      include: {
        provider: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    const remindersSent = [];

    for (const deadline of deadlinesNeedingReminders) {
      let reminderType = null;
      let shouldSend = false;

      // Check for 24h reminder
      if (deadline.deadlineDate <= twentyFourHoursFromNow && !deadline.reminderSent24h) {
        reminderType = '24h';
        shouldSend = true;
      }
      // Check for 48h reminder
      else if (deadline.deadlineDate <= fortyEightHoursFromNow && !deadline.reminderSent48h) {
        reminderType = '48h';
        shouldSend = true;
      }
      // Check for 72h reminder
      else if (deadline.deadlineDate <= seventyTwoHoursFromNow && !deadline.reminderSent72h) {
        reminderType = '72h';
        shouldSend = true;
      }

      if (shouldSend) {
        // Update the reminder flag
        const updateData: any = {};
        if (reminderType === '24h') updateData.reminderSent24h = true;
        if (reminderType === '48h') updateData.reminderSent48h = true;
        if (reminderType === '72h') updateData.reminderSent72h = true;

        await this.prisma.complianceDeadline.update({
          where: { id: deadline.id },
          data: updateData,
        });

        remindersSent.push({
          deadlineId: deadline.id,
          providerName: `${deadline.provider.firstName} ${deadline.provider.lastName}`,
          providerEmail: deadline.provider.email,
          deadlineDate: deadline.deadlineDate,
          reminderType,
        });
      }
    }

    return {
      message: `Sent ${remindersSent.length} reminders`,
      remindersSent,
    };
  }
} 