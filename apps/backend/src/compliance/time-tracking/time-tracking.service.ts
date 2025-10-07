import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';

@Injectable()
export class TimeTrackingService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllTimeEntries(startDate?: string, endDate?: string, userId?: string) {
    const where: any = {};

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Set to end of day
      
      where.entryDate = {
        gte: start,
        lte: end,
      };
    } else if (startDate) {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      
      where.entryDate = {
        gte: start,
        lt: end,
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

  private calculateHours(
    clockInTime: Date,
    clockOutTime: Date,
    breakStartTime?: Date | null,
    breakEndTime?: Date | null
  ): { totalHours: number; regularHours: number; eveningHours: number; weekendHours: number } {
    // Calculate total work time in milliseconds
    let totalWorkTimeMs = clockOutTime.getTime() - clockInTime.getTime();
    
    // Subtract break time if both break start and end are provided
    if (breakStartTime && breakEndTime) {
      const breakTimeMs = breakEndTime.getTime() - breakStartTime.getTime();
      totalWorkTimeMs -= breakTimeMs;
    }
    
    // Convert to hours
    const totalHours = Math.round((totalWorkTimeMs / (1000 * 60 * 60)) * 100) / 100;
    
    // Calculate evening hours (after 6 PM)
    const eveningHours = this.calculateEveningHours(clockInTime, clockOutTime, breakStartTime, breakEndTime);
    
    // Calculate weekend hours (Saturday and Sunday)
    const weekendHours = this.calculateWeekendHours(clockInTime, clockOutTime, breakStartTime, breakEndTime);
    
    // For individual time entries, regular hours = total hours
    // Overtime will be calculated weekly when processing payments
    const regularHours = totalHours;
    
    return {
      totalHours,
      regularHours,
      eveningHours: Math.round(eveningHours * 100) / 100,
      weekendHours: Math.round(weekendHours * 100) / 100
    };
  }

  private calculateEveningHours(
    clockInTime: Date,
    clockOutTime: Date,
    breakStartTime?: Date | null,
    breakEndTime?: Date | null
  ): number {
    const eveningStart = new Date(clockInTime);
    eveningStart.setHours(18, 0, 0, 0); // 6 PM
    
    const eveningEnd = new Date(clockOutTime);
    eveningEnd.setHours(18, 0, 0, 0); // 6 PM
    
    // If clock out is before 6 PM, no evening hours
    if (clockOutTime <= eveningStart) {
      return 0;
    }
    
    // If clock in is after 6 PM, all hours are evening hours
    if (clockInTime >= eveningStart) {
      let eveningHours = (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);
      
      // Subtract break time if it falls within evening hours
      if (breakStartTime && breakEndTime) {
        const breakStartEvening = new Date(Math.max(breakStartTime.getTime(), eveningStart.getTime()));
        const breakEndEvening = new Date(Math.min(breakEndTime.getTime(), clockOutTime.getTime()));
        
        if (breakStartEvening < breakEndEvening) {
          const breakEveningHours = (breakEndEvening.getTime() - breakStartEvening.getTime()) / (1000 * 60 * 60);
          eveningHours -= breakEveningHours;
        }
      }
      
      return Math.max(0, eveningHours);
    }
    
    // Clock in before 6 PM, clock out after 6 PM
    let eveningHours = (clockOutTime.getTime() - eveningStart.getTime()) / (1000 * 60 * 60);
    
    // Subtract break time if it falls within evening hours
    if (breakStartTime && breakEndTime) {
      const breakStartEvening = new Date(Math.max(breakStartTime.getTime(), eveningStart.getTime()));
      const breakEndEvening = new Date(Math.min(breakEndTime.getTime(), clockOutTime.getTime()));
      
      if (breakStartEvening < breakEndEvening) {
        const breakEveningHours = (breakEndEvening.getTime() - breakStartEvening.getTime()) / (1000 * 60 * 60);
        eveningHours -= breakEveningHours;
      }
    }
    
    return Math.max(0, eveningHours);
  }

  private calculateWeekendHours(
    clockInTime: Date,
    clockOutTime: Date,
    breakStartTime?: Date | null,
    breakEndTime?: Date | null
  ): number {
    const dayOfWeek = clockInTime.getDay(); // 0 = Sunday, 6 = Saturday
    
    // If not weekend, return 0
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      return 0;
    }
    
    // If it's a weekend, calculate total hours
    let weekendHours = (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);
    
    // Subtract break time
    if (breakStartTime && breakEndTime) {
      const breakHours = (breakEndTime.getTime() - breakStartTime.getTime()) / (1000 * 60 * 60);
      weekendHours -= breakHours;
    }
    
    return Math.max(0, weekendHours);
  }

  async createTimeEntry(createTimeEntryDto: CreateTimeEntryDto) {
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

    // Calculate hours if clock out time is provided
    if (data.clockOutTime) {
      const { totalHours, regularHours, eveningHours, weekendHours } = this.calculateHours(
        data.clockInTime,
        data.clockOutTime,
        data.breakStartTime,
        data.breakEndTime
      );
      
      data.totalHours = totalHours;
      data.regularHours = regularHours;
      data.eveningHours = eveningHours;
      data.weekendHours = weekendHours;
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

    // Recalculate hours if any time-related fields are updated
    if (data.clockInTime || data.clockOutTime || data.breakStartTime || data.breakEndTime) {
      const clockIn = data.clockInTime || timeEntry.clockInTime;
      const clockOut = data.clockOutTime || timeEntry.clockOutTime;
      const breakStart = data.breakStartTime || timeEntry.breakStartTime;
      const breakEnd = data.breakEndTime || timeEntry.breakEndTime;

      if (clockOut) {
        const { totalHours, regularHours, eveningHours, weekendHours } = this.calculateHours(
          clockIn,
          clockOut,
          breakStart,
          breakEnd
        );
        
        data.totalHours = totalHours;
        data.regularHours = regularHours;
        data.eveningHours = eveningHours;
        data.weekendHours = weekendHours;
      }
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

    // Calculate hours when clocking out
    const { totalHours, regularHours, eveningHours, weekendHours } = this.calculateHours(
      timeEntry.clockInTime,
      clockOutTime,
      timeEntry.breakStartTime,
      timeEntry.breakEndTime
    );

    return this.prisma.timeEntry.update({
      where: { id },
      data: {
        clockOutTime,
        totalHours,
        regularHours,
        eveningHours,
        weekendHours,
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

  async updateBreakTimes(id: string, breakStartTime?: Date, breakEndTime?: Date) {
    const timeEntry = await this.getTimeEntryById(id);

    if (!timeEntry.clockOutTime) {
      throw new BadRequestException('Cannot update break times for active time entry');
    }

    // Recalculate hours with new break times
    const { totalHours, regularHours, eveningHours, weekendHours } = this.calculateHours(
      timeEntry.clockInTime,
      timeEntry.clockOutTime,
      breakStartTime,
      breakEndTime
    );

    return this.prisma.timeEntry.update({
      where: { id },
      data: {
        breakStartTime,
        breakEndTime,
        totalHours,
        regularHours,
        eveningHours,
        weekendHours,
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

  async askForUpdateTimeEntry(id: string, requestedBy: string, updateNotes?: string) {
    const timeEntry = await this.getTimeEntryById(id);

    if (timeEntry.isApproved) {
      throw new BadRequestException('Cannot request update for an already approved time entry');
    }

    // Add admin notes to the existing notes
    const adminNotes = `[Admin Request for Update - ${new Date().toLocaleString()}]\n${updateNotes || 'Please review and update this time entry.'}`;
    const updatedNotes = timeEntry.notes 
      ? `${timeEntry.notes}\n\n${adminNotes}` 
      : adminNotes;

    return this.prisma.timeEntry.update({
      where: { id },
      data: {
        isApproved: false,
        approvedBy: requestedBy,
        approvedAt: new Date(),
        notes: updatedNotes,
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