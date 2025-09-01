import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { SessionCompletionService } from './session-completion.service';

@Injectable()
export class SessionManagementService {
  private readonly logger = new Logger(SessionManagementService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly sessionCompletionService: SessionCompletionService,
  ) {}

  /**
   * Complete session lifecycle: Schedule → Deliver → Document → Bill → Pay
   */
  async completeSessionLifecycle(appointmentId: string, providerId: string) {
    try {
      // 1. Get appointment details
      const appointment = await this.prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
          clients: true,
          staff: true,
        },
      });

      if (!appointment) {
        throw new NotFoundException(`Appointment with ID ${appointmentId} not found`);
      }

      // 2. Check if appointment is completed
      if (appointment.status !== 'completed' && appointment.status !== 'attended') {
        throw new BadRequestException('Appointment must be completed before creating session completion');
      }

      // 3. Create session completion
      const sessionCompletion = await this.sessionCompletionService.createFromAppointment(appointmentId);

      // 4. Update appointment status if needed
      if (appointment.status !== 'completed') {
        await this.prisma.appointment.update({
          where: { id: appointmentId },
          data: { status: 'completed' },
        });
      }

      // 5. Create clinical note template if it doesn't exist
      const existingNote = await this.prisma.clinicalNote.findFirst({
        where: {
          clientId: appointment.clientId,
          providerId: appointment.providerId,
          noteType: 'progress_note',
          title: `Session Note - ${appointment.appointmentType}`,
        },
      });

      if (!existingNote) {
        await this.prisma.clinicalNote.create({
          data: {
            clientId: appointment.clientId,
            providerId: appointment.providerId,
            noteType: 'progress_note',
            title: `Session Note - ${appointment.appointmentType}`,
            content: {
              sessionDate: appointment.startTime.toISOString(),
              sessionType: appointment.appointmentType,
              duration: appointment.duration,
              status: 'draft',
            },
            status: 'draft',
          },
        });
      }

      this.logger.log(`Session lifecycle completed for appointment ${appointmentId}`);
      return sessionCompletion;
    } catch (error) {
      this.logger.error(`Error completing session lifecycle: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get comprehensive session overview for a provider
   */
  async getSessionOverview(providerId: string, dateRange?: { start: Date; end: Date }) {
    const startDate = dateRange?.start || new Date();
    const endDate = dateRange?.end || new Date();

    // Get appointments in date range
    const appointments = await this.prisma.appointment.findMany({
      where: {
        providerId,
        startTime: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        clients: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Get session completions in date range
    const sessionCompletions = await this.prisma.sessionCompletion.findMany({
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

    // Get clinical notes in date range
    const clinicalNotes = await this.prisma.clinicalNote.findMany({
      where: {
        providerId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        noteType: 'progress_note',
      },
    });

    // Calculate metrics
    const totalAppointments = appointments.length;
    const completedSessions = sessionCompletions.length;
    const signedNotes = clinicalNotes.filter(note => note.signedAt).length;
    const pendingNotes = clinicalNotes.filter(note => !note.signedAt).length;

    // Group by session type
    const sessionTypeBreakdown = sessionCompletions.reduce((acc, session) => {
      const type = session.sessionType;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate revenue
    const totalRevenue = sessionCompletions.reduce((sum, session) => {
      return sum + (session.calculatedAmount || 0);
    }, 0);

    return {
      period: { startDate, endDate },
      metrics: {
        totalAppointments,
        completedSessions,
        signedNotes,
        pendingNotes,
        completionRate: totalAppointments > 0 ? (completedSessions / totalAppointments) * 100 : 0,
        noteCompletionRate: completedSessions > 0 ? (signedNotes / completedSessions) * 100 : 0,
      },
      sessionTypeBreakdown,
      totalRevenue,
      appointments,
      sessionCompletions,
      clinicalNotes,
    };
  }

  /**
   * Get session compliance status for a specific week
   */
  async getWeeklyComplianceStatus(providerId: string, weekStart: Date) {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    // Get all sessions for the week
    const sessions = await this.prisma.sessionCompletion.findMany({
      where: {
        providerId,
        sessionDate: {
          gte: weekStart,
          lte: weekEnd,
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

    // Get clinical notes for the week
    const notes = await this.prisma.clinicalNote.findMany({
      where: {
        providerId,
        createdAt: {
          gte: weekStart,
          lte: weekEnd,
        },
        noteType: 'progress_note',
      },
    });

    // Calculate compliance metrics
    const totalSessions = sessions.length;
    const signedNotes = notes.filter(note => note.signedAt).length;
    const unsignedNotes = totalSessions - signedNotes;
    const completionRate = totalSessions > 0 ? (signedNotes / totalSessions) * 100 : 0;

    // Check deadline compliance
    const deadline = this.calculateNoteDeadline(weekStart);
    const isDeadlinePassed = new Date() > deadline;
    const isCompliant = !isDeadlinePassed || unsignedNotes === 0;

    return {
      weekStart,
      weekEnd,
      deadline,
      isDeadlinePassed,
      isCompliant,
      metrics: {
        totalSessions,
        signedNotes,
        unsignedNotes,
        completionRate,
      },
      sessions: sessions.map(session => ({
        id: session.id,
        clientName: `${session.client.firstName} ${session.client.lastName}`,
        sessionDate: session.sessionDate,
        sessionType: session.sessionType,
        durationMinutes: session.durationMinutes,
        isNoteSigned: session.isNoteSigned,
        isLocked: session.isLocked,
        calculatedAmount: session.calculatedAmount,
      })),
    };
  }

  /**
   * Process payment for completed sessions
   */
  async processPayment(providerId: string, payPeriodWeek: Date) {
    // Get all signed sessions for the pay period
    const sessions = await this.prisma.sessionCompletion.findMany({
      where: {
        providerId,
        payPeriodWeek,
        isNoteSigned: true,
        isPaid: false,
      },
    });

    if (sessions.length === 0) {
      return { message: 'No unpaid sessions found for this pay period' };
    }

    // Calculate total payment
    const totalAmount = sessions.reduce((sum, session) => {
      return sum + (session.calculatedAmount || 0);
    }, 0);

    const totalHours = sessions.reduce((sum, session) => {
      return sum + (session.durationMinutes / 60);
    }, 0);

    // Mark sessions as paid
    await this.prisma.sessionCompletion.updateMany({
      where: {
        id: { in: sessions.map(s => s.id) },
      },
      data: {
        isPaid: true,
      },
    });

    // Create payment record
    const payment = await this.prisma.paymentCalculation.create({
      data: {
        userId: providerId,
        payPeriodStart: payPeriodWeek,
        payPeriodEnd: new Date(payPeriodWeek.getTime() + 6 * 24 * 60 * 60 * 1000), // 6 days later
        totalHours,
        totalAmount,
        status: 'processed',
        processedAt: new Date(),
      },
    });

    this.logger.log(`Payment processed for provider ${providerId}: $${totalAmount} for ${totalHours} hours`);

    return {
      paymentId: payment.id,
      totalAmount,
      totalHours,
      sessionsProcessed: sessions.length,
      payPeriodWeek,
    };
  }

  /**
   * Get session analytics and trends
   */
  async getSessionAnalytics(providerId: string, startDate: Date, endDate: Date) {
    // Get sessions in date range
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
      orderBy: {
        sessionDate: 'asc',
      },
    });

    // Calculate daily trends
    const dailyTrends = this.calculateDailyTrends(sessions, startDate, endDate);

    // Calculate session type distribution
    const sessionTypeDistribution = this.calculateSessionTypeDistribution(sessions);

    // Calculate client retention
    const clientRetention = this.calculateClientRetention(sessions);

    // Calculate revenue trends
    const revenueTrends = this.calculateRevenueTrends(sessions, startDate, endDate);

    return {
      period: { startDate, endDate },
      totalSessions: sessions.length,
      totalRevenue: sessions.reduce((sum, s) => sum + (s.calculatedAmount || 0), 0),
      totalHours: sessions.reduce((sum, s) => sum + (s.durationMinutes / 60), 0),
      dailyTrends,
      sessionTypeDistribution,
      clientRetention,
      revenueTrends,
      sessions,
    };
  }

  /**
   * Bulk operations for session management
   */
  async bulkSessionOperations(operations: Array<{
    type: 'create' | 'update' | 'delete' | 'sign' | 'lock';
    sessionId?: string;
    appointmentId?: string;
    data?: any;
  }>) {
    const results = [];

    for (const operation of operations) {
      try {
        let result;
        switch (operation.type) {
          case 'create':
            if (operation.appointmentId) {
              result = await this.sessionCompletionService.createFromAppointment(operation.appointmentId);
            }
            break;
          case 'update':
            if (operation.sessionId && operation.data) {
              result = await this.sessionCompletionService.updateSessionCompletion(operation.sessionId, operation.data);
            }
            break;
          case 'delete':
            if (operation.sessionId) {
              result = await this.sessionCompletionService.deleteSessionCompletion(operation.sessionId);
            }
            break;
          case 'sign':
            if (operation.sessionId && operation.data?.signedBy) {
              result = await this.sessionCompletionService.signNote(operation.sessionId, operation.data.signedBy);
            }
            break;
          case 'lock':
            if (operation.sessionId && operation.data?.lockedBy) {
              result = await this.sessionCompletionService.lockSession(
                operation.sessionId,
                operation.data.lockedBy,
                operation.data.reason
              );
            }
            break;
        }
        results.push({ operation: operation.type, success: true, result });
      } catch (error) {
        results.push({ operation: operation.type, success: false, error: error.message });
      }
    }

    return results;
  }

  // Helper methods

  private calculateNoteDeadline(weekStart: Date): Date {
    const deadline = new Date(weekStart);
    deadline.setDate(weekStart.getDate() + 6); // Saturday
    deadline.setHours(23, 59, 59, 999);
    return deadline;
  }

  private calculateDailyTrends(sessions: any[], startDate: Date, endDate: Date) {
    const trends = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const daySessions = sessions.filter(s => {
        const sessionDate = new Date(s.sessionDate);
        return sessionDate.toDateString() === currentDate.toDateString();
      });

      trends.push({
        date: new Date(currentDate),
        sessions: daySessions.length,
        revenue: daySessions.reduce((sum, s) => sum + (s.calculatedAmount || 0), 0),
        hours: daySessions.reduce((sum, s) => sum + (s.durationMinutes / 60), 0),
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return trends;
  }

  private calculateSessionTypeDistribution(sessions: any[]) {
    return sessions.reduce((acc, session) => {
      const type = session.sessionType;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private calculateClientRetention(sessions: any[]) {
    const clientSessions = sessions.reduce((acc, session) => {
      const clientId = session.clientId;
      if (!acc[clientId]) {
        acc[clientId] = {
          clientId,
          clientName: `${session.client.firstName} ${session.client.lastName}`,
          sessions: [],
        };
      }
      acc[clientId].sessions.push(session);
      return acc;
    }, {} as Record<string, {
      clientId: string;
      clientName: string;
      sessions: any[];
    }>);

    return Object.values(clientSessions).map((client: {
      clientId: string;
      clientName: string;
      sessions: any[];
    }) => ({
      ...client,
      totalSessions: client.sessions.length,
      totalRevenue: client.sessions.reduce((sum, s) => sum + (s.calculatedAmount || 0), 0),
      lastSession: client.sessions.sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime())[0],
    }));
  }

  private calculateRevenueTrends(sessions: any[], startDate: Date, endDate: Date) {
    const trends = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const weekStart = new Date(currentDate);
      const weekEnd = new Date(currentDate);
      weekEnd.setDate(currentDate.getDate() + 6);

      const weekSessions = sessions.filter(s => {
        const sessionDate = new Date(s.sessionDate);
        return sessionDate >= weekStart && sessionDate <= weekEnd;
      });

      trends.push({
        weekStart: new Date(weekStart),
        weekEnd: new Date(weekEnd),
        sessions: weekSessions.length,
        revenue: weekSessions.reduce((sum, s) => sum + (s.calculatedAmount || 0), 0),
        hours: weekSessions.reduce((sum, s) => sum + (s.durationMinutes / 60), 0),
      });

      currentDate.setDate(currentDate.getDate() + 7);
    }

    return trends;
  }
}
