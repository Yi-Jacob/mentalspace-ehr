import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateSessionCompletionDto } from './dto/create-session-completion.dto';
import { UpdateSessionCompletionDto } from './dto/update-session-completion.dto';

@Injectable()
export class SessionCompletionService {
  private readonly logger = new Logger(SessionCompletionService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getAllSessionCompletions(status?: string, providerId?: string, clientId?: string) {
    const where: any = {};

    if (providerId) {
      where.providerId = providerId;
    }

    if (clientId) {
      where.clientId = clientId;
    }

    if (status) {
      if (status === 'signed') {
        where.isNoteSigned = true;
      } else if (status === 'unsigned') {
        where.isNoteSigned = false;
        where.isLocked = false;
      } else if (status === 'locked') {
        where.isLocked = true;
      }
    }

    return this.prisma.sessionCompletion.findMany({
      where,
      include: {
        provider: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        client: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        sessionDate: 'desc',
      },
    });
  }

  async getSessionCompletionById(id: string) {
    const sessionCompletion = await this.prisma.sessionCompletion.findUnique({
      where: { id },
      include: {
        provider: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        client: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!sessionCompletion) {
      throw new NotFoundException(`Session completion with ID ${id} not found`);
    }

    return sessionCompletion;
  }

  async createSessionCompletion(createSessionCompletionDto: CreateSessionCompletionDto) {
    const data: any = {
      ...createSessionCompletionDto,
      sessionDate: new Date(createSessionCompletionDto.sessionDate),
    };

    if (createSessionCompletionDto.noteSignedAt) {
      data.noteSignedAt = new Date(createSessionCompletionDto.noteSignedAt);
    }
    if (createSessionCompletionDto.lockedAt) {
      data.lockedAt = new Date(createSessionCompletionDto.lockedAt);
    }
    if (createSessionCompletionDto.payPeriodWeek) {
      data.payPeriodWeek = new Date(createSessionCompletionDto.payPeriodWeek);
    }
    if (createSessionCompletionDto.supervisorOverrideAt) {
      data.supervisorOverrideAt = new Date(createSessionCompletionDto.supervisorOverrideAt);
    }

    // Calculate pay period week if not provided
    if (!data.payPeriodWeek) {
      data.payPeriodWeek = this.calculatePayPeriodWeek(data.sessionDate);
    }

    // Calculate amount if not provided
    if (!data.calculatedAmount) {
      data.calculatedAmount = await this.calculateSessionAmount(
        createSessionCompletionDto.providerId,
        createSessionCompletionDto.sessionType,
        createSessionCompletionDto.durationMinutes
      );
    }

    return this.prisma.sessionCompletion.create({
      data,
      include: {
        provider: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        client: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async updateSessionCompletion(id: string, updateSessionCompletionDto: UpdateSessionCompletionDto) {
    const sessionCompletion = await this.getSessionCompletionById(id);

    const data: any = { ...updateSessionCompletionDto };

    if (updateSessionCompletionDto.sessionDate) {
      data.sessionDate = new Date(updateSessionCompletionDto.sessionDate);
    }
    if (updateSessionCompletionDto.noteSignedAt) {
      data.noteSignedAt = new Date(updateSessionCompletionDto.noteSignedAt);
    }
    if (updateSessionCompletionDto.lockedAt) {
      data.lockedAt = new Date(updateSessionCompletionDto.lockedAt);
    }
    if (updateSessionCompletionDto.payPeriodWeek) {
      data.payPeriodWeek = new Date(updateSessionCompletionDto.payPeriodWeek);
    }
    if (updateSessionCompletionDto.supervisorOverrideAt) {
      data.supervisorOverrideAt = new Date(updateSessionCompletionDto.supervisorOverrideAt);
    }

    return this.prisma.sessionCompletion.update({
      where: { id },
      data,
      include: {
        provider: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        client: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async deleteSessionCompletion(id: string) {
    const sessionCompletion = await this.getSessionCompletionById(id);

    return this.prisma.sessionCompletion.delete({
      where: { id },
    });
  }

  async signNote(id: string, signedBy: string) {
    const sessionCompletion = await this.getSessionCompletionById(id);

    if (sessionCompletion.isNoteSigned) {
      throw new BadRequestException('Note is already signed');
    }

    if (sessionCompletion.isLocked) {
      throw new BadRequestException('Session is locked and cannot be signed');
    }

    // Check if note signing is within deadline
    const isWithinDeadline = this.isWithinNoteDeadline(sessionCompletion.sessionDate);
    if (!isWithinDeadline) {
      throw new BadRequestException('Note signing deadline has passed. Supervisor approval required.');
    }

    return this.prisma.sessionCompletion.update({
      where: { id },
      data: {
        isNoteSigned: true,
        noteSignedAt: new Date(),
      },
      include: {
        provider: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        client: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async lockSession(id: string, lockedBy: string, reason?: string) {
    const sessionCompletion = await this.getSessionCompletionById(id);

    if (sessionCompletion.isLocked) {
      throw new BadRequestException('Session is already locked');
    }

    return this.prisma.sessionCompletion.update({
      where: { id },
      data: {
        isLocked: true,
        lockedAt: new Date(),
      },
      include: {
        provider: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        client: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async supervisorOverride(id: string, overrideBy: string, reason: string) {
    const sessionCompletion = await this.getSessionCompletionById(id);

    return this.prisma.sessionCompletion.update({
      where: { id },
      data: {
        supervisorOverrideBy: overrideBy,
        supervisorOverrideReason: reason,
        supervisorOverrideAt: new Date(),
        isLocked: false, // Unlock the session
      },
      include: {
        provider: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        client: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  // New methods for comprehensive session management

  async getComplianceDeadlines(providerId: string) {
    const currentDate = new Date();
    const payPeriodWeek = this.calculatePayPeriodWeek(currentDate);
    
    // Get all sessions for the current pay period
    const sessions = await this.prisma.sessionCompletion.findMany({
      where: {
        providerId,
        payPeriodWeek,
      },
      include: {
        client: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const unsignedSessions = sessions.filter(s => !s.isNoteSigned);
    const signedSessions = sessions.filter(s => s.isNoteSigned);

    return {
      payPeriodWeek,
      totalSessions: sessions.length,
      signedSessions: signedSessions.length,
      unsignedSessions: unsignedSessions.length,
      deadline: this.getNoteDeadline(payPeriodWeek),
      isDeadlinePassed: this.isDeadlinePassed(payPeriodWeek),
      sessions: {
        signed: signedSessions,
        unsigned: unsignedSessions,
      },
    };
  }

  async getPaymentCalculation(providerId: string, payPeriodWeek?: Date) {
    const targetPayPeriod = payPeriodWeek || this.calculatePayPeriodWeek(new Date());
    
    const sessions = await this.prisma.sessionCompletion.findMany({
      where: {
        providerId,
        payPeriodWeek: targetPayPeriod,
        isNoteSigned: true, // Only signed notes count for payment
      },
    });

    const totalHours = sessions.reduce((sum, session) => sum + (session.durationMinutes / 60), 0);
    const totalAmount = sessions.reduce((sum, session) => sum + (session.calculatedAmount || 0), 0);

    return {
      payPeriodWeek: targetPayPeriod,
      totalSessions: sessions.length,
      totalHours,
      totalAmount,
      sessions,
    };
  }

  async getProviderDashboard(providerId: string) {
    const currentDate = new Date();
    const payPeriodWeek = this.calculatePayPeriodWeek(currentDate);
    
    // Get today's sessions
    const todaySessions = await this.prisma.sessionCompletion.findMany({
      where: {
        providerId,
        sessionDate: {
          gte: new Date(currentDate.setHours(0, 0, 0, 0)),
          lt: new Date(currentDate.setHours(23, 59, 59, 999)),
        },
      },
      include: {
        client: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Get unsigned notes for current pay period
    const unsignedNotes = await this.prisma.sessionCompletion.findMany({
      where: {
        providerId,
        payPeriodWeek,
        isNoteSigned: false,
        isLocked: false,
      },
      include: {
        client: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Get compliance status
    const compliance = await this.getComplianceDeadlines(providerId);

    return {
      todaySessions,
      unsignedNotes,
      compliance,
      payPeriodWeek,
    };
  }

  async getSessionAnalytics(providerId: string, startDate: Date, endDate: Date) {
    const sessions = await this.prisma.sessionCompletion.findMany({
      where: {
        providerId,
        sessionDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        client: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(s => s.isNoteSigned).length;
    const completionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;
    
    const totalHours = sessions.reduce((sum, session) => sum + (session.durationMinutes / 60), 0);
    const totalRevenue = sessions.reduce((sum, session) => sum + (session.calculatedAmount || 0), 0);

    // Group by session type
    const sessionTypeBreakdown = sessions.reduce((acc, session) => {
      const type = session.sessionType;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      period: { startDate, endDate },
      totalSessions,
      completedSessions,
      completionRate,
      totalHours,
      totalRevenue,
      sessionTypeBreakdown,
      sessions,
    };
  }

  async createFromAppointment(appointmentId: string) {
    // Get appointment details
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        clients: true,
        provider: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${appointmentId} not found`);
    }

    // Check if session completion already exists
    const existingSession = await this.prisma.sessionCompletion.findFirst({
      where: { appointmentId },
    });

    if (existingSession) {
      throw new BadRequestException('Session completion already exists for this appointment');
    }

    // Create session completion
    const sessionCompletion = await this.createSessionCompletion({
      appointmentId,
      providerId: appointment.providerId,
      clientId: appointment.clientId,
      sessionType: appointment.appointmentType,
      durationMinutes: appointment.duration,
      sessionDate: appointment.startTime.toISOString(),
    });

    return sessionCompletion;
  }

  async bulkCreateFromAppointments(appointmentIds: string[]) {
    const results = [];
    
    for (const appointmentId of appointmentIds) {
      try {
        const session = await this.createFromAppointment(appointmentId);
        results.push({ appointmentId, success: true, session });
      } catch (error) {
        results.push({ appointmentId, success: false, error: error.message });
      }
    }

    return results;
  }

  // Helper methods

  private calculatePayPeriodWeek(sessionDate: Date): Date {
    // Pay period runs Sunday to Saturday
    const date = new Date(sessionDate);
    const dayOfWeek = date.getDay();
    const daysToSunday = dayOfWeek === 0 ? 0 : dayOfWeek;
    
    const payPeriodStart = new Date(date);
    payPeriodStart.setDate(date.getDate() - daysToSunday);
    payPeriodStart.setHours(0, 0, 0, 0);
    
    return payPeriodStart;
  }

  /**
   * Calculate note deadline dynamically
   */
  getNoteDeadline(sessionDate: Date): Date {
    const payPeriodStart = this.calculatePayPeriodWeek(sessionDate);
    const deadline = new Date(payPeriodStart);
    deadline.setDate(payPeriodStart.getDate() + 6); // Saturday
    deadline.setHours(23, 59, 59, 999);
    return deadline;
  }

  /**
   * Get deadline status without separate table
   */
  getDeadlineStatus(session: any): {
    status: 'pending' | 'met' | 'overdue' | 'urgent';
    deadline: Date;
    isOverdue: boolean;
  } {
    const deadline = this.getNoteDeadline(session.sessionDate);
    const now = new Date();
    
    if (session.isNoteSigned) {
      return { status: 'met', deadline, isOverdue: false };
    }
    
    if (now > deadline) {
      return { status: 'overdue', deadline, isOverdue: true };
    }
    
    const hoursUntilDeadline = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (hoursUntilDeadline <= 24) {
      return { status: 'urgent', deadline, isOverdue: false };
    }
    
    return { status: 'pending', deadline, isOverdue: false };
  }

  /**
   * Get all sessions with deadline status
   */
  async getSessionsWithDeadlines(providerId?: string) {

    const sessions = await this.prisma.sessionCompletion.findMany({
      where: providerId ? { providerId } : {},
      include: { 
        client: {
          select: {
            firstName: true,
            lastName: true,
          }
        },
        provider: {
          select: {
            firstName: true,
            lastName: true,
          }
        }
      },
      orderBy: {
        sessionDate: 'desc',
      },
    });

    return sessions.map(session => ({
      ...session,
      deadline: this.getNoteDeadline(session.sessionDate).toISOString(),
      deadlineStatus: this.getDeadlineStatus(session)
    }));
  }

  /**
   * Mark session as completed (note signed)
   */
  async markSessionAsCompleted(id: string) {
    const session = await this.getSessionCompletionById(id);
    
    return this.prisma.sessionCompletion.update({
      where: { id },
      data: {
        isNoteSigned: true,
        noteSignedAt: new Date(),
      },
      include: {
        client: {
          select: {
            firstName: true,
            lastName: true,
          }
        },
        provider: {
          select: {
            firstName: true,
            lastName: true,
          }
        }
      },
    });
  }

  private isDeadlinePassed(payPeriodWeek: Date): boolean {
    const deadline = this.getNoteDeadline(payPeriodWeek);
    return new Date() > deadline;
  }

  private isWithinNoteDeadline(sessionDate: Date): boolean {
    const payPeriodWeek = this.calculatePayPeriodWeek(sessionDate);
    const deadline = this.getNoteDeadline(payPeriodWeek);
    return new Date() <= deadline;
  }

  private async calculateSessionAmount(providerId: string, sessionType: string, durationMinutes: number): Promise<number> {
    // Get provider compensation configuration
    const compensation = await this.prisma.providerCompensationConfig.findFirst({
      where: {
        providerId,
        isActive: true,
      },
    });

    if (!compensation) {
      // Default calculation
      return (durationMinutes / 60) * 100; // $100 per hour default
    }

    let baseRate = compensation.baseSessionRate || compensation.baseHourlyRate || 100;
    
    // Apply session type multiplier if available
    const multiplier = await this.prisma.sessionRateMultiplier.findFirst({
      where: {
        providerId,
        sessionType,
        isActive: true,
      },
    });

    if (multiplier) {
      baseRate *= multiplier.multiplier;
    }

    // Calculate based on duration
    const hours = durationMinutes / 60;
    return baseRate * hours;
  }

  async getWeeklyComplianceReport(providerId: string, weekStart: Date) {
    const payPeriodWeek = this.calculatePayPeriodWeek(weekStart);
    const deadline = this.getNoteDeadline(payPeriodWeek);
    
    const sessions = await this.prisma.sessionCompletion.findMany({
      where: {
        providerId,
        payPeriodWeek,
      },
      include: {
        client: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        sessionDate: 'asc',
      },
    });

    const report = {
      weekStart: payPeriodWeek,
      deadline,
      totalSessions: sessions.length,
      signedSessions: sessions.filter(s => s.isNoteSigned).length,
      unsignedSessions: sessions.filter(s => !s.isNoteSigned && !s.isLocked).length,
      lockedSessions: sessions.filter(s => s.isLocked).length,
      completionRate: sessions.length > 0 ? (sessions.filter(s => s.isNoteSigned).length / sessions.length) * 100 : 0,
      sessions: sessions.map(session => ({
        id: session.id,
        clientName: `${session.client.firstName} ${session.client.lastName}`,
        sessionDate: session.sessionDate,
        sessionType: session.sessionType,
        durationMinutes: session.durationMinutes,
        isNoteSigned: session.isNoteSigned,
        isLocked: session.isLocked,
        noteSignedAt: session.noteSignedAt,
        calculatedAmount: session.calculatedAmount,
      })),
    };

    return report;
  }
} 