import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
  QueryAppointmentsDto,
  CheckConflictsDto,
  CreateWaitlistDto,
  CreateScheduleDto,
  AppointmentStatus,
  RecurringPattern,
} from './dto';

@Injectable()
export class SchedulingService {
  constructor(private prisma: PrismaService) {}

  async createAppointment(createAppointmentDto: CreateAppointmentDto, userId: string) {
    const { clientId, startTime, duration, recurringPattern, recurringTimeSlots, recurringEndDate, isBusinessDayOnly } = createAppointmentDto;
    
    // Set provider ID from JWT token if not provided
    const providerId = createAppointmentDto.providerId || userId;
    
    // Calculate end time from start time and duration
    const startDateTime = new Date(startTime);

    // If there's a recurring pattern, create all recurring appointments directly
    if (recurringPattern && recurringTimeSlots && recurringTimeSlots.length > 0) {
      return await this.createRecurringAppointmentsOnly(
        createAppointmentDto,
        userId,
        recurringPattern,
        startDateTime,
        recurringTimeSlots,
        isBusinessDayOnly ?? true,
        recurringEndDate
      );
    }

    // Create the initial appointment (non-recurring)
    const appointment = await this.prisma.appointment.create({
      data: {
        clientId,
        providerId,
        appointmentType: createAppointmentDto.appointmentType,
        title: createAppointmentDto.title,
        description: createAppointmentDto.description,
        startTime: startDateTime,
        duration,
        status: AppointmentStatus.SCHEDULED,
        location: createAppointmentDto.location,
        roomNumber: createAppointmentDto.roomNumber,
        recurringRuleId: null,
        createdBy: createAppointmentDto.createdBy || userId,
      },
    });

    return appointment;
  }

  private async createRecurringAppointmentsOnly(
    createAppointmentDto: CreateAppointmentDto,
    userId: string,
    pattern: RecurringPattern,
    startDate: Date,
    timeSlots: any[],
    isBusinessDayOnly: boolean,
    endDate?: string
  ) {
    // Set default end date to 1 year from start if not provided
    const recurringEndDate = endDate ? new Date(endDate) : new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000);
    
    // Generate appointment dates based on the recurring pattern
    const appointmentDates = this.generateRecurringDates(
      pattern,
      startDate,
      recurringEndDate,
      timeSlots,
      isBusinessDayOnly
    );

    // Create all recurring appointments including the first one
    const appointments = [];
    for (const appointmentDate of appointmentDates) {
      const appointmentData = {
        clientId: createAppointmentDto.clientId,
        providerId: createAppointmentDto.providerId || userId,
        appointmentType: createAppointmentDto.appointmentType,
        title: createAppointmentDto.title,
        description: createAppointmentDto.description,
        startTime: appointmentDate,
        duration: createAppointmentDto.duration,
        status: AppointmentStatus.SCHEDULED,
        location: createAppointmentDto.location,
        roomNumber: createAppointmentDto.roomNumber,
        recurringRuleId: null,
        createdBy: userId,
      };

      appointments.push(appointmentData);
    }

    // Create all recurring appointments in a transaction
    if (appointments.length > 0) {
      const createdAppointments = await this.prisma.appointment.createMany({
        data: appointments
      });
      
      // Return the first appointment as the main result
      return {
        id: 'recurring-appointments-created',
        message: `Created ${appointments.length} recurring appointments`,
        appointments: appointments
      };
    }

    return { message: 'No recurring appointments created' };
  }

  private generateRecurringDates(
    pattern: RecurringPattern,
    startDate: Date,
    endDate: Date,
    timeSlots: any[],
    isBusinessDayOnly: boolean
  ): Date[] {
    const dates: Date[] = [];
    
    // For each time slot, generate appointments starting from the start date
    for (const timeSlot of timeSlots) {
      let currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        const appointmentDate = new Date(currentDate);
        console.log("timeSlot", timeSlot)
        if (timeSlot.dayOfWeek !== undefined) {
          appointmentDate.setDate(currentDate.getDate() + (timeSlot.dayOfWeek - currentDate.getDay() + 7) % 7);
        }
        
        if (timeSlot.dayOfMonth !== undefined) {
          appointmentDate.setDate(timeSlot.dayOfMonth);
        }
        
        if (timeSlot.month !== undefined) {
          appointmentDate.setMonth(timeSlot.month - 1); // Month is 0-indexed in JavaScript
        }
        
        // NOW set the time from the time slot
        const [hours, minutes] = timeSlot.time.split(':').map(Number);
        appointmentDate.setHours(hours, minutes, 0, 0);
        
        // Check if this date should be included based on the pattern
        let shouldInclude = false;
        console.log("appointmentDate", appointmentDate)
        switch (pattern) {
          case RecurringPattern.DAILY:
            shouldInclude = !isBusinessDayOnly || this.isBusinessDay(appointmentDate);
            break;
          
          case RecurringPattern.WEEKLY:
            shouldInclude = timeSlot.dayOfWeek === appointmentDate.getDay() &&
              (!isBusinessDayOnly || this.isBusinessDay(appointmentDate));
            break;
          
          case RecurringPattern.MONTHLY:
            shouldInclude = timeSlot.dayOfMonth === appointmentDate.getDate() &&
              (!isBusinessDayOnly || this.isBusinessDay(appointmentDate));
            break;
          
          case RecurringPattern.YEARLY:
            shouldInclude = timeSlot.month === (appointmentDate.getMonth() + 1) &&
              timeSlot.dayOfMonth === appointmentDate.getDate() &&
              (!isBusinessDayOnly || this.isBusinessDay(appointmentDate));
            break;
        }

        if (shouldInclude && appointmentDate >= startDate && appointmentDate <= endDate) {
          dates.push(new Date(appointmentDate));
        }

        // Move to next date based on pattern
        switch (pattern) {
          case RecurringPattern.DAILY:
            currentDate.setDate(currentDate.getDate() + 1);
            break;
          case RecurringPattern.WEEKLY:
            currentDate.setDate(currentDate.getDate() + 7);
            break;
          case RecurringPattern.MONTHLY:
            currentDate.setMonth(currentDate.getMonth() + 1);
            break;
          case RecurringPattern.YEARLY:
            currentDate.setFullYear(currentDate.getFullYear() + 1);
            break;
        }
      }
    }

    return dates.sort((a, b) => a.getTime() - b.getTime());
  }

  private isBusinessDay(date: Date): boolean {
    const day = date.getDay();
    return day >= 1 && day <= 5; // Monday = 1, Friday = 5
  }

  async findAll(query: QueryAppointmentsDto) {
    const where: any = {};

    if (query.clientId) {
      where.clientId = query.clientId;
    }

    if (query.providerId) {
      where.providerId = query.providerId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.appointmentType) {
      where.appointmentType = query.appointmentType;
    }

    if (query.startDate && query.endDate) {
      where.startTime = {
        gte: new Date(query.startDate),
        lte: new Date(query.endDate),
      };
    }

    const appointments = await this.prisma.appointment.findMany({
      where,
      orderBy: {
        startTime: 'asc',
      },
    });

    // Apply search filter if provided
    if (query.search) {
      return appointments.filter(appointment => {
        return (
          (appointment.title || '').toLowerCase().includes(query.search.toLowerCase()) ||
          appointment.appointmentType.toLowerCase().includes(query.search.toLowerCase())
        );
      });
    }

    return appointments;
  }

  async findOne(id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return appointment;
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    const appointment = await this.findOne(id);

    const updateData: any = {
      ...updateAppointmentDto,
      updatedAt: new Date(),
    };

    // Handle status-specific timestamps
    if (updateAppointmentDto.status) {
      if (updateAppointmentDto.status === AppointmentStatus.COMPLETED) {
        updateData.completedAt = new Date();
      } else if (updateAppointmentDto.status === AppointmentStatus.CHECKED_IN) {
        updateData.checkedInAt = new Date();
      } else if (updateAppointmentDto.status === AppointmentStatus.CANCELLED) {
        updateData.cancelledAt = new Date();
      }
    }

    return this.prisma.appointment.update({
      where: { id },
      data: updateData,
    });
  }

  async updateStatus(id: string, status: AppointmentStatus) {
    const appointment = await this.findOne(id);

    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    // Add timestamp fields for specific statuses
    if (status === AppointmentStatus.COMPLETED) {
      updateData.completedAt = new Date();
    } else if (status === AppointmentStatus.CHECKED_IN) {
      updateData.checkedInAt = new Date();
    } else if (status === AppointmentStatus.CANCELLED) {
      updateData.cancelledAt = new Date();
    }

    return this.prisma.appointment.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    const appointment = await this.findOne(id);
    
    await this.prisma.appointment.delete({
      where: { id },
    });

    return { message: 'Appointment deleted successfully' };
  }

  async checkConflicts(checkConflictsDto: CheckConflictsDto) {
    const { appointmentId, providerId, clientId, startTime, endTime } = checkConflictsDto;

    // Calculate end time from start time and duration for existing appointments
    const conflicts = await this.prisma.appointment.findMany({
      where: {
        OR: [
          { providerId },
          { clientId },
        ],
        NOT: {
          status: {
            in: [AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW],
          },
        },
        AND: [
          {
            // Check if existing appointment overlaps with new appointment time
            startTime: {
              lt: new Date(endTime), // Existing appointment starts before new appointment ends
            },
          },
          {
            // Check if existing appointment ends after new appointment starts
            startTime: {
              gte: new Date(new Date(startTime).getTime() - 60 * 60000), // Assuming 60 min default duration for existing
            },
          },
        ],
        ...(appointmentId && { id: { not: appointmentId } }),
      },
    });

    const conflictDetails = conflicts.map(conflict => {
      const isProviderConflict = conflict.providerId === providerId;
      const isClientConflict = conflict.clientId === clientId;
      
      return {
        ...conflict,
        conflictType: isProviderConflict ? 'provider_overlap' : 'client_overlap',
        message: isProviderConflict 
          ? `Provider already has an appointment at this time`
          : `Client already has an appointment at this time`,
      };
    });

    return {
      conflicts: conflictDetails,
      hasConflicts: conflictDetails.length > 0,
    };
  }

  async createWaitlistEntry(createWaitlistDto: CreateWaitlistDto) {
    return this.prisma.appointmentWaitlist.create({
      data: {
        clientId: createWaitlistDto.clientId,
        providerId: createWaitlistDto.providerId,
        preferredDate: new Date(createWaitlistDto.preferredDate),
        preferredTimeStart: createWaitlistDto.preferredTimeStart,
        preferredTimeEnd: createWaitlistDto.preferredTimeEnd,
        appointmentType: createWaitlistDto.appointmentType,
        notes: createWaitlistDto.notes,
        priority: createWaitlistDto.priority || 1,
        isFulfilled: false,
      },
    });
  }

  async getWaitlistEntries() {
    return this.prisma.appointmentWaitlist.findMany({
      where: {
        isFulfilled: false,
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'asc' },
      ],
    });
  }

  async createProviderSchedule(createScheduleDto: CreateScheduleDto) {
    return this.prisma.providerSchedule.create({
      data: {
        providerId: createScheduleDto.providerId,
        dayOfWeek: createScheduleDto.dayOfWeek,
        startTime: createScheduleDto.startTime,
        endTime: createScheduleDto.endTime,
        isAvailable: createScheduleDto.isAvailable ?? true,
        breakStartTime: createScheduleDto.breakStartTime,
        breakEndTime: createScheduleDto.breakEndTime,
        effectiveFrom: createScheduleDto.effectiveFrom ? new Date(createScheduleDto.effectiveFrom) : new Date(),
        effectiveUntil: createScheduleDto.effectiveUntil ? new Date(createScheduleDto.effectiveUntil) : null,
        status: createScheduleDto.status || 'active',
      },
    });
  }

  async getProviderSchedules(providerId?: string) {
    const where: any = {};
    if (providerId) {
      where.providerId = providerId;
    }

    return this.prisma.providerSchedule.findMany({
      where,
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' },
      ],
    });
  }

  async getScheduleExceptions() {
    return this.prisma.scheduleException.findMany({
      orderBy: {
        exceptionDate: 'asc',
      },
    });
  }
} 