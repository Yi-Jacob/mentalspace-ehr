import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UserTypeService } from '../common/user-type.service';
import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
  QueryAppointmentsDto,
  CheckConflictsDto,
  CreateWaitlistDto,
  CreateScheduleDto,
  CreateScheduleExceptionDto,
  AppointmentStatus,
  RecurringPattern,
} from './dto';

@Injectable()
export class SchedulingService {
  constructor(
    private prisma: PrismaService,
    private userTypeService: UserTypeService,
  ) {}

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
    
    // First, create the recurring rule record
    const recurringRule = await this.prisma.recurringRule.create({
      data: {
        recurringPattern: pattern,
        startDate: startDate,
        endDate: recurringEndDate,
        timeSlots: timeSlots,
        isBusinessDayOnly: isBusinessDayOnly,
      },
    });

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
        recurringRuleId: recurringRule.id, // Assign the ID of the newly created recurring rule
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

  async findAll(query: QueryAppointmentsDto, user?: { id: string; email: string; roles: string[] }) {
    const where: any = {};
    // Role-based access control
    if (user) {
      // Define role groups
      const adminRoles = ['Practice Administrator', 'Clinical Administrator', 'Practice Scheduler'];

      // Check if user has admin roles - full access
      if (user.roles.some(role => adminRoles.includes(role))) {
        // Admin users can see all appointments - no additional filtering needed
      } else {
        // Check if user is a client
        const client = await this.userTypeService.getClientByUserId(user.id);
        if (client) {
          // Client can only see their own appointments
          where.clientId = client.id;
        } else {
          // Check if user is staff
          const staffProfile = await this.userTypeService.getStaffProfileByUserId(user.id);
          if (staffProfile) {
            where.providerId = user.id;
          } else {
            // If user is neither client nor staff, return empty result
            return [];
          }
        }
      }
    }

    // Apply query filters
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
      include: {
        clients: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        recurringRule: {
          select: {
            id: true,
            recurringPattern: true,
            startDate: true,
            endDate: true,
            timeSlots: true,
            isBusinessDayOnly: true,
          },
        },
      },
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
      include: {
        clients: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        recurringRule: {
          select: {
            id: true,
            recurringPattern: true,
            startDate: true,
            endDate: true,
            timeSlots: true,
            isBusinessDayOnly: true,
          },
        },
      },
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

    // Handle recurring rule updates
    if (updateAppointmentDto.recurringPattern && updateAppointmentDto.recurringTimeSlots && appointment.recurringRuleId) {
      // First, update the current appointment with basic details (title, description, etc.)
      // This ensures the new recurring appointments have the updated information
      if (updateAppointmentDto.title || updateAppointmentDto.description || updateAppointmentDto.location || 
          updateAppointmentDto.roomNumber || updateAppointmentDto.appointmentType || updateAppointmentDto.duration) {
        await this.prisma.appointment.update({
          where: { id },
          data: {
            title: updateAppointmentDto.title,
            description: updateAppointmentDto.description,
            appointmentType: updateAppointmentDto.appointmentType,
            location: updateAppointmentDto.location,
            roomNumber: updateAppointmentDto.roomNumber,
            duration: updateAppointmentDto.duration,
            updatedAt: new Date()
          }
        });
      }
      
      // Update the recurring rule
      await this.updateRecurringRule(
        appointment.recurringRuleId,
        updateAppointmentDto.recurringPattern,
        updateAppointmentDto.recurringTimeSlots,
        updateAppointmentDto.isBusinessDayOnly ?? true,
        updateAppointmentDto.recurringEndDate
      );

      // Delete existing recurring appointments from current time onwards
      const deletedCount = await this.deleteFutureRecurringAppointments(appointment.recurringRuleId, appointment.startTime);
      console.log(`Deleted ${deletedCount.count} future recurring appointments`);

      // Create new recurring appointments based on the updated rule
      const startDate = appointment.startTime;
      const createdCount = await this.createRecurringAppointmentsFromRule(
        appointment.recurringRuleId,
        startDate,
        updateAppointmentDto.recurringPattern,
        updateAppointmentDto.recurringTimeSlots,
        updateAppointmentDto.isBusinessDayOnly ?? true,
        updateAppointmentDto.recurringEndDate,
        updateAppointmentDto // Pass the updated appointment data
      );
      console.log(`Created ${createdCount.count} new recurring appointments`);
      
      // Return message instead of updated appointment since it was deleted and recreated
      return {
        message: `Recurring rule updated successfully. Deleted ${deletedCount.count} old appointments and created ${createdCount.count} new recurring appointments.`,
        updatedRecurringRule: true,
        deletedCount: deletedCount.count,
        createdCount: createdCount.count
      };
    }

    // Only update and return the appointment if no recurring rule changes
    return this.prisma.appointment.update({
      where: { id },
      data: updateData,
      include: {
        clients: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
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
      include: {
        clients: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const appointment = await this.findOne(id);
    
    await this.prisma.appointment.delete({
      where: { id },
    });

    return { message: 'Appointment deleted successfully' };
  }

  // Recurring rule management methods
  private async updateRecurringRule(
    ruleId: string,
    pattern: RecurringPattern,
    timeSlots: any[],
    isBusinessDayOnly: boolean,
    endDate?: string
  ) {
    const updateData: any = {
      recurringPattern: pattern,
      timeSlots: timeSlots,
      isBusinessDayOnly,
      updatedAt: new Date(),
    };

    if (endDate) {
      updateData.endDate = new Date(endDate);
    }

    return this.prisma.recurringRule.update({
      where: { id: ruleId },
      data: updateData,
    });
  }

  private async deleteFutureRecurringAppointments(ruleId: string, startTime: Date) {
    const now = startTime;
    
    return this.prisma.appointment.deleteMany({
      where: {
        recurringRuleId: ruleId,
        startTime: {
          gte: now,
        },
      },
    });
  }

  private async createRecurringAppointmentsFromRule(
    ruleId: string,
    startDate: Date,
    pattern: RecurringPattern,
    timeSlots: any[],
    isBusinessDayOnly: boolean,
    endDate?: string,
    updatedAppointmentData?: any // Add parameter for updated appointment data
  ) {
    // Get the recurring rule to get appointment details
    const rule = await this.prisma.recurringRule.findUnique({
      where: { id: ruleId },
    });

    if (!rule) {
      throw new Error('Recurring rule not found');
    }

    // Get one of the existing appointments to copy basic details
    const existingAppointment = await this.prisma.appointment.findFirst({
      where: { recurringRuleId: ruleId },
    });

    if (!existingAppointment) {
      throw new Error('No existing appointments found for this recurring rule');
    }

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

    // Create new recurring appointments
    const appointments = [];
    for (const appointmentDate of appointmentDates) {
      const appointmentData = {
        clientId: existingAppointment.clientId,
        providerId: existingAppointment.providerId,
        appointmentType: updatedAppointmentData?.appointmentType || existingAppointment.appointmentType,
        title: updatedAppointmentData?.title || existingAppointment.title,
        description: updatedAppointmentData?.description || existingAppointment.description,
        startTime: appointmentDate,
        duration: updatedAppointmentData?.duration || existingAppointment.duration,
        status: AppointmentStatus.SCHEDULED,
        location: updatedAppointmentData?.location || existingAppointment.location,
        roomNumber: updatedAppointmentData?.roomNumber || existingAppointment.roomNumber,
        recurringRuleId: ruleId,
        createdBy: existingAppointment.createdBy,
      };

      appointments.push(appointmentData);
    }

    // Create all recurring appointments in a transaction
    if (appointments.length > 0) {
      return await this.prisma.appointment.createMany({
        data: appointments
      });
    }

    return { count: 0 };
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

  async createProviderSchedule(createScheduleDto: CreateScheduleDto, userId: string) {
    return this.prisma.providerSchedule.create({
      data: {
        providerId: userId, // Use the userId from JWT token
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

  async createProviderSchedules(schedules: CreateScheduleDto[], userId: string) {
    // Create all schedules in a transaction
    const createdSchedules = await this.prisma.providerSchedule.createMany({
      data: schedules.map(schedule => ({
        providerId: userId, // Use the userId from JWT token
        dayOfWeek: schedule.dayOfWeek,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        isAvailable: schedule.isAvailable ?? true,
        breakStartTime: schedule.breakStartTime,
        breakEndTime: schedule.breakEndTime,
        effectiveFrom: schedule.effectiveFrom ? new Date(schedule.effectiveFrom) : new Date(),
        effectiveUntil: schedule.effectiveUntil ? new Date(schedule.effectiveUntil) : null,
        status: schedule.status || 'active',
      })),
    });

    return {
      message: `Created ${createdSchedules.count} provider schedules successfully`,
      count: createdSchedules.count,
    };
  }

  async updateProviderSchedules(updateSchedulesDto: CreateScheduleDto[], userId: string) {
    // First, delete all existing schedules for the user
    await this.prisma.providerSchedule.deleteMany({
      where: {
        providerId: userId,
      },
    });

    // Then create all new schedules with updated data
    const createdSchedules = await this.prisma.providerSchedule.createMany({
      data: updateSchedulesDto.map(schedule => ({
        providerId: userId, // Always use the userId from JWT token
        dayOfWeek: schedule.dayOfWeek,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        isAvailable: schedule.isAvailable ?? true,
        breakStartTime: schedule.breakStartTime,
        breakEndTime: schedule.breakEndTime,
        effectiveFrom: schedule.effectiveFrom ? new Date(schedule.effectiveFrom) : new Date(),
        effectiveUntil: schedule.effectiveUntil ? new Date(schedule.effectiveUntil) : null,
        status: schedule.status || 'active',
      })),
    });

    return {
      message: `Updated ${createdSchedules.count} provider schedules successfully`,
      count: createdSchedules.count,
    };
  }

  async deleteAllProviderSchedules(userId: string) {
    // Delete all schedules for the authenticated user
    const deletedSchedules = await this.prisma.providerSchedule.deleteMany({
      where: {
        providerId: userId,
      },
    });

    return {
      message: `Deleted ${deletedSchedules.count} provider schedules successfully`,
      count: deletedSchedules.count,
    };
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

  async createScheduleException(createExceptionDto: CreateScheduleExceptionDto, userId: string) {
    return this.prisma.scheduleException.create({
      data: {
        providerId: userId, // Use the userId from JWT token
        exceptionDate: new Date(createExceptionDto.exceptionDate),
        startTime: createExceptionDto.startTime,
        endTime: createExceptionDto.endTime,
        isUnavailable: createExceptionDto.isUnavailable ?? true,
        reason: createExceptionDto.reason,
      },
    });
  }

  async updateScheduleException(id: string, updateExceptionDto: CreateScheduleExceptionDto, userId: string) {
    // First check if the exception exists and belongs to the user
    const existingException = await this.prisma.scheduleException.findFirst({
      where: {
        id,
        providerId: userId,
      },
    });

    if (!existingException) {
      throw new NotFoundException(`Schedule exception with ID ${id} not found`);
    }

    return this.prisma.scheduleException.update({
      where: { id },
      data: {
        exceptionDate: new Date(updateExceptionDto.exceptionDate),
        startTime: updateExceptionDto.startTime,
        endTime: updateExceptionDto.endTime,
        isUnavailable: updateExceptionDto.isUnavailable ?? true,
        reason: updateExceptionDto.reason,
        updatedAt: new Date(),
      },
    });
  }

  async deleteScheduleException(id: string, userId: string) {
    // First check if the exception exists and belongs to the user
    const existingException = await this.prisma.scheduleException.findFirst({
      where: {
        id,
        providerId: userId,
      },
    });

    if (!existingException) {
      throw new NotFoundException(`Schedule exception with ID ${id} not found`);
    }

    await this.prisma.scheduleException.delete({
      where: { id },
    });

    return { message: 'Schedule exception deleted successfully' };
  }
} 