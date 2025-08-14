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
} from './dto';

@Injectable()
export class SchedulingService {
  constructor(private prisma: PrismaService) {}

  async createAppointment(createAppointmentDto: CreateAppointmentDto, userId: string) {
    const { clientId, startTime, duration } = createAppointmentDto;
    
    // Set provider ID from JWT token if not provided
    const providerId = createAppointmentDto.providerId || userId;
    
    // Calculate end time from start time and duration
    const startDateTime = new Date(startTime);
    const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

    // Check for conflicts
    const conflicts = await this.checkConflicts({
      providerId,
      clientId,
      startTime,
      endTime: endDateTime.toISOString(),
    });

    if (conflicts.hasConflicts) {
      throw new BadRequestException('Appointment conflicts detected');
    }

    // Create the appointment with only the fields that the Prisma client recognizes
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
        recurringRuleId: createAppointmentDto.recurringRuleId,
        createdBy: createAppointmentDto.createdBy || userId,
      },
    });

    return appointment;
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