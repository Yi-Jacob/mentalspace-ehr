import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';

@Injectable()
export class TimeTrackingService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllTimeEntries(date?: string, userId?: string) {
    const where: any = {};

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      
      where.entryDate = {
        gte: startDate,
        lt: endDate,
      };
    }

    if (userId) {
      where.userId = userId;
    }

    return this.prisma.timeEntry.findMany({
      where,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        approvedByUser: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getTimeEntryById(id: string) {
    const timeEntry = await this.prisma.timeEntry.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        approvedByUser: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!timeEntry) {
      throw new NotFoundException(`Time entry with ID ${id} not found`);
    }

    return timeEntry;
  }

  async createTimeEntry(createTimeEntryDto: CreateTimeEntryDto) {
    console.log(createTimeEntryDto);
    const data: any = {
      ...createTimeEntryDto,
      entryDate: new Date(createTimeEntryDto.entryDate),
      clockInTime: new Date(createTimeEntryDto.clockInTime),
    };

    if (createTimeEntryDto.clockOutTime) {
      data.clockOutTime = new Date(createTimeEntryDto.clockOutTime);
    }
    if (createTimeEntryDto.breakStartTime) {
      data.breakStartTime = new Date(createTimeEntryDto.breakStartTime);
    }
    if (createTimeEntryDto.breakEndTime) {
      data.breakEndTime = new Date(createTimeEntryDto.breakEndTime);
    }
    if (createTimeEntryDto.approvedAt) {
      data.approvedAt = new Date(createTimeEntryDto.approvedAt);
    }

    return this.prisma.timeEntry.create({
      data,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        approvedByUser: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async updateTimeEntry(id: string, updateTimeEntryDto: UpdateTimeEntryDto) {
    const timeEntry = await this.getTimeEntryById(id);

    const data: any = { ...updateTimeEntryDto };

    if (updateTimeEntryDto.entryDate) {
      data.entryDate = new Date(updateTimeEntryDto.entryDate);
    }
    if (updateTimeEntryDto.clockInTime) {
      data.clockInTime = new Date(updateTimeEntryDto.clockInTime);
    }
    if (updateTimeEntryDto.clockOutTime) {
      data.clockOutTime = new Date(updateTimeEntryDto.clockOutTime);
    }
    if (updateTimeEntryDto.breakStartTime) {
      data.breakStartTime = new Date(updateTimeEntryDto.breakStartTime);
    }
    if (updateTimeEntryDto.breakEndTime) {
      data.breakEndTime = new Date(updateTimeEntryDto.breakEndTime);
    }
    if (updateTimeEntryDto.approvedAt) {
      data.approvedAt = new Date(updateTimeEntryDto.approvedAt);
    }

    return this.prisma.timeEntry.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        approvedByUser: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async deleteTimeEntry(id: string) {
    const timeEntry = await this.getTimeEntryById(id);

    return this.prisma.timeEntry.delete({
      where: { id },
    });
  }

  async clockIn(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already clocked in today
    const existingEntry = await this.prisma.timeEntry.findFirst({
      where: {
        userId,
        entryDate: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
        clockOutTime: null,
      },
    });

    if (existingEntry) {
      throw new BadRequestException('Already clocked in today');
    }

    const entryData = {
      userId,
      entryDate: today,
      clockInTime: new Date(),
      isApproved: false,
    };

    return this.prisma.timeEntry.create({
      data: entryData,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async clockOut(id: string) {
    const timeEntry = await this.getTimeEntryById(id);

    if (timeEntry.clockOutTime) {
      throw new BadRequestException('Already clocked out');
    }

    const clockOutTime = new Date();

    return this.prisma.timeEntry.update({
      where: { id },
      data: {
        clockOutTime,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async approveTimeEntry(id: string, approvedBy: string) {
    const timeEntry = await this.getTimeEntryById(id);

    if (timeEntry.isApproved) {
      throw new BadRequestException('Time entry is already approved');
    }

    return this.prisma.timeEntry.update({
      where: { id },
      data: {
        isApproved: true,
        approvedBy,
        approvedAt: new Date(),
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        approvedByUser: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async getActiveTimeEntry(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.prisma.timeEntry.findFirst({
      where: {
        userId,
        entryDate: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
        clockOutTime: null,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }
} 