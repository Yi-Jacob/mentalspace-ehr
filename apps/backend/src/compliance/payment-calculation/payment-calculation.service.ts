import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface WeeklyPaymentCalculation {
  payPeriodWeek: Date;
  providerId: string;
  providerName: string;
  totalSessions: number;
  totalHours: number;
  totalAmount: number;
  compensationType: 'session_based' | 'hourly';
  sessions: Array<{
    id: string;
    clientName: string;
    sessionDate: Date;
    sessionType: string;
    durationMinutes: number;
    calculatedAmount: number;
    isNoteSigned: boolean;
    noteSignedAt?: Date;
    // Additional fields for hourly payments
    regularHours?: number;
    overtimeHours?: number;
    eveningHours?: number;
    weekendHours?: number;
    baseRate?: number;
    overtimeRate?: number;
    eveningDifferential?: number;
    weekendDifferential?: number;
  }>;
  compensationConfig?: {
    baseSessionRate?: number;
    baseHourlyRate?: number;
    compensationType: string;
    isOvertimeEligible?: boolean;
    eveningDifferential?: number;
    weekendDifferential?: number;
  };
}

export interface PaymentCalculationSummary {
  providerId: string;
  providerName: string;
  payPeriodWeek: Date;
  totalSessions: number;
  totalHours: number;
  totalAmount: number;
  status: 'pending' | 'processed' | 'cancelled';
  processedAt?: Date;
  processedBy?: string;
}

@Injectable()
export class PaymentCalculationService {
  private readonly logger = new Logger(PaymentCalculationService.name);

  constructor(private readonly prisma: PrismaService) {}

    /**
   * Calculate weekly payment for a specific provider
   */
  async calculateWeeklyPayment(providerId: string, payPeriodWeek?: Date): Promise<WeeklyPaymentCalculation> {
    const targetPayPeriod = payPeriodWeek || this.calculatePayPeriodWeek(new Date());
    
    // Get provider information and staff profile
    const provider = await this.prisma.user.findUnique({
      where: { id: providerId },
      select: {
        firstName: true,
        lastName: true,
        staffId: true, // Use staffId, not staffProfile
      },
    });

    if (!provider) {
      throw new NotFoundException(`Provider with ID ${providerId} not found`);
    }

    if (!provider.staffId) {
      throw new NotFoundException(`Provider with ID ${providerId} does not have a staff ID`);
    }

    // Get compensation configuration using staffId
    const compensationConfig = await this.prisma.providerCompensationConfig.findFirst({
      where: {
        providerId: provider.staffId, // Use staffId, not staffProfile.id
        isActive: true,
      },
    });

    if (!compensationConfig) {
      throw new NotFoundException(`No active compensation configuration found for provider ${providerId}`);
    }

    let totalAmount = 0;
    let totalHours = 0;
    let totalSessions = 0;
    let sessions: any[] = [];

    // Calculate based on compensation type
    if (compensationConfig.compensationType === 'session_based') {
      // Session-based calculation - get sessions from Appointment table
      const sessionCompletions = await this.prisma.appointment.findMany({
        where: {
          providerId,
          hasSession: true,
          startTime: {
            gte: targetPayPeriod,
            lt: new Date(targetPayPeriod.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days later
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
        orderBy: {
          startTime: 'asc',
        },
      });

      totalSessions = sessionCompletions.length;
      totalHours = sessionCompletions.reduce((sum, session) => sum + (session.duration / 60), 0);

      // Calculate payment for each session
      sessions = sessionCompletions.map(session => {
        const calculatedAmount = this.calculateSessionBasedPayment(session, compensationConfig);
        totalAmount += calculatedAmount;

        return {
          id: session.id,
          clientName: `${session.clients.firstName} ${session.clients.lastName}`,
          sessionDate: session.startTime,
          sessionType: session.appointmentType,
          durationMinutes: session.duration,
          calculatedAmount,
        };
      });

    } else if (compensationConfig.compensationType === 'hourly') {
      // Hourly-based calculation - get time entries from TimeEntry table
      const timeEntries = await this.prisma.timeEntry.findMany({
        where: {
          userId: providerId,
          entryDate: {
            gte: targetPayPeriod,
            lt: new Date(targetPayPeriod.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days later
          },
          isApproved: true, // Only approved time entries count for payment
        },
        orderBy: {
          entryDate: 'asc',
        },
      });

      totalSessions = timeEntries.length; // For hourly, sessions = time entries
      totalHours = timeEntries.reduce((sum, entry) => sum + (entry.totalHours || 0), 0);

      // Calculate weekly overtime
      const weeklyOvertimeHours = this.calculateWeeklyOvertime(timeEntries, compensationConfig);

      // Calculate payment for each time entry
      sessions = timeEntries.map(entry => {
        const calculatedAmount = this.calculateHourlyBasedPayment(entry, compensationConfig);
        totalAmount += calculatedAmount;

        return {
          id: entry.id,
          clientName: 'Time Entry', // For hourly, no specific client
          sessionDate: entry.entryDate,
          sessionType: 'Work Hours',
          durationMinutes: (entry.totalHours || 0) * 60,
          calculatedAmount,
          isNoteSigned: true, // Time entries are always "signed" when approved
          noteSignedAt: entry.approvedAt,
          // Additional hourly fields
          regularHours: entry.regularHours || 0,
          overtimeHours: weeklyOvertimeHours, // Weekly overtime hours
          eveningHours: entry.eveningHours || 0,
          weekendHours: entry.weekendHours || 0,
          baseRate: compensationConfig.baseHourlyRate,
          overtimeRate: compensationConfig.isOvertimeEligible ? (compensationConfig.baseHourlyRate || 0) * 1.5 : 0,
          eveningDifferential: compensationConfig.eveningDifferential,
          weekendDifferential: compensationConfig.weekendDifferential,
        };
      });

      // Add overtime amount to total
      if (compensationConfig.isOvertimeEligible && weeklyOvertimeHours > 0) {
        const overtimeRate = (compensationConfig.baseHourlyRate || 0) * 1.5;
        totalAmount += weeklyOvertimeHours * overtimeRate;
      }
    }

    return {
      payPeriodWeek: targetPayPeriod,
      providerId,
      providerName: `${provider.firstName} ${provider.lastName}`,
      totalSessions,
      totalHours,
      totalAmount,
      compensationType: compensationConfig.compensationType as 'session_based' | 'hourly',
      sessions,
      compensationConfig: {
        baseSessionRate: compensationConfig.baseSessionRate,
        baseHourlyRate: compensationConfig.baseHourlyRate,
        compensationType: compensationConfig.compensationType,
        isOvertimeEligible: compensationConfig.isOvertimeEligible,
        eveningDifferential: compensationConfig.eveningDifferential,
        weekendDifferential: compensationConfig.weekendDifferential,
      },
    };
  }

  /**
   * Calculate session-based payment
   */
  private calculateSessionBasedPayment(session: any, config: any): number {
    let baseAmount = config.baseSessionRate || 0;
    
    // Apply session type multipliers if available
    const sessionMultiplier = this.getSessionMultiplier(session.appointmentType, session.duration);
    baseAmount *= sessionMultiplier;

    // Apply duration-based proration
    const durationMultiplier = this.getDurationMultiplier(session.duration);
    baseAmount *= durationMultiplier;

    return baseAmount;
  }

  /**
   * Calculate hourly-based payment
   */
  private calculateHourlyBasedPayment(timeEntry: any, config: any): number {
    const hourlyRate = config.baseHourlyRate || 0;
    const totalHours = timeEntry.totalHours || 0;
    const regularHours = timeEntry.regularHours || 0;
    const eveningHours = timeEntry.eveningHours || 0;
    const weekendHours = timeEntry.weekendHours || 0;
    
    let totalAmount = 0;
    
    // Regular hours (excluding evening and weekend hours)
    const standardHours = regularHours - eveningHours - weekendHours;
    totalAmount += standardHours * hourlyRate;
    
    // Evening hours with differential
    if (config.eveningDifferential && eveningHours > 0) {
      totalAmount += eveningHours * (hourlyRate + config.eveningDifferential);
    } else if (eveningHours > 0) {
      totalAmount += eveningHours * hourlyRate;
    }
    
    // Weekend hours with differential
    if (config.weekendDifferential && weekendHours > 0) {
      totalAmount += weekendHours * (hourlyRate + config.weekendDifferential);
    } else if (weekendHours > 0) {
      totalAmount += weekendHours * hourlyRate;
    }

    return totalAmount;
  }

  /**
   * Calculate evening hours (after 6 PM)
   */
  private calculateEveningHours(clockIn: Date, clockOut: Date): number {
    const eveningStart = 18; // 6 PM
    const clockInHour = clockIn.getHours();
    const clockOutHour = clockOut.getHours();
    
    if (clockInHour >= eveningStart) {
      // Started in evening
      return (clockOutHour - clockInHour) + (clockOut.getMinutes() - clockIn.getMinutes()) / 60;
    } else if (clockOutHour >= eveningStart) {
      // Started before evening, ended in evening
      return (clockOutHour - eveningStart) + clockOut.getMinutes() / 60;
    }
    
    return 0;
  }

  /**
   * Calculate weekly overtime hours
   */
  private calculateWeeklyOvertime(timeEntries: any[], config: any): number {
    if (!config.isOvertimeEligible) {
      return 0;
    }

    const weeklyRegularHoursLimit = 40; // Standard 40-hour work week
    const totalWeeklyHours = timeEntries.reduce((sum, entry) => sum + (entry.totalHours || 0), 0);
    
    return Math.max(0, totalWeeklyHours - weeklyRegularHoursLimit);
  }

  /**
   * Get session type multiplier
   */
  private getSessionMultiplier(sessionType: string, durationMinutes: number): number {
    const multipliers: { [key: string]: number } = {
      'individual': 1.0,
      'group': 0.7, // Group sessions typically pay less per person
      'family': 1.2, // Family sessions may pay more due to complexity
      'couples': 1.1,
      'intake': 1.3, // Intake sessions often pay more
      'assessment': 1.2,
      'consultation': 1.1,
    };

    return multipliers[sessionType.toLowerCase()] || 1.0;
  }

  /**
   * Get duration-based multiplier
   */
  private getDurationMultiplier(durationMinutes: number): number {
    const standardDuration = 60; // Standard 60-minute session
    return durationMinutes / standardDuration;
  }

  /**
   * Get payment calculations for all providers in a specific week
   */
  async getWeeklyPaymentCalculations(payPeriodWeek?: Date): Promise<PaymentCalculationSummary[]> {
    const targetPayPeriod = payPeriodWeek || this.calculatePayPeriodWeek(new Date());
    
    // Get all providers with active compensation configs
    const providers = await this.prisma.providerCompensationConfig.findMany({
      where: {
        isActive: true,
      },
      include: {
        provider: {
          select: {
            id: true, // This is the StaffProfile ID
          },
        },
      },
    });

    const calculations: PaymentCalculationSummary[] = [];

    for (const providerConfig of providers) {
      try {
        // Find the user that has this staffId
        const user = await this.prisma.user.findFirst({
          where: {
            staffId: providerConfig.provider.id, // provider.id is the StaffProfile ID
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        });

        if (!user) {
          this.logger.warn(`No user found for staff profile ${providerConfig.provider.id}`);
          continue;
        }

        const calculation = await this.calculateWeeklyPayment(user.id, targetPayPeriod);
        
        calculations.push({
          providerId: user.id, // Use user ID
          providerName: calculation.providerName,
          payPeriodWeek: calculation.payPeriodWeek,
          totalSessions: calculation.totalSessions,
          totalHours: calculation.totalHours,
          totalAmount: calculation.totalAmount,
          status: 'pending',
        });
      } catch (error) {
        // Skip providers without signed sessions or other issues
        this.logger.warn(`Skipping provider ${providerConfig.providerId}: ${error.message}`);
      }
    }

    return calculations;
  }

  /**
   * Process payment for a specific provider and week
   */
  async processPayment(providerId: string, payPeriodWeek?: Date, processedBy?: string) {
    const calculation = await this.calculateWeeklyPayment(providerId, payPeriodWeek);
    
    if (calculation.totalSessions === 0) {
      throw new NotFoundException('No signed sessions found for payment processing');
    }

    // Check if payment already exists
    const existingPayment = await this.prisma.paymentCalculation.findFirst({
      where: {
        userId: providerId,
        payPeriodStart: calculation.payPeriodWeek,
      },
    });

    if (existingPayment) {
      throw new Error('Payment for this period has already been processed');
    }

    // Create payment calculation record
    const paymentCalculation = await this.prisma.paymentCalculation.create({
      data: {
        userId: providerId,
        payPeriodStart: calculation.payPeriodWeek,
        payPeriodEnd: new Date(calculation.payPeriodWeek.getTime() + 6 * 24 * 60 * 60 * 1000), // 6 days later
        totalHours: calculation.totalHours,
        totalAmount: calculation.totalAmount,
        grossAmount: calculation.totalAmount,
        status: 'processed',
        processedBy,
        processedAt: new Date(),
      },
    });

    // Mark sessions as paid
    await this.prisma.appointment.updateMany({
      where: {
        providerId,
        hasSession: true,
      },
      data: {
        isPaid: true,
      },
    });

    this.logger.log(`Payment processed for provider ${providerId}: $${calculation.totalAmount} for ${calculation.totalHours} hours`);

    return {
      paymentId: paymentCalculation.id,
      ...calculation,
      status: 'processed',
      processedAt: paymentCalculation.processedAt,
    };
  }

  /**
   * Get payment history for a provider
   */
  async getPaymentHistory(providerId: string, startDate?: Date, endDate?: Date) {
    const where: any = { userId: providerId };
    
    if (startDate && endDate) {
      where.payPeriodStart = {
        gte: startDate,
        lte: endDate,
      };
    }

    return this.prisma.paymentCalculation.findMany({
      where,
      include: {
        processedByUser: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        payPeriodStart: 'desc',
      },
    });
  }

  /**
   * Get all payment calculations with filters
   */
  async getAllPaymentCalculations(filters?: {
    status?: string;
    providerId?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const where: any = {};

    if (filters?.status && filters.status !== 'all') {
      where.status = filters.status;
    }

    if (filters?.providerId) {
      where.userId = filters.providerId;
    }

    if (filters?.startDate && filters?.endDate) {
      where.payPeriodStart = {
        gte: filters.startDate,
        lte: filters.endDate,
      };
    }

    return this.prisma.paymentCalculation.findMany({
      where,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        processedByUser: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        payPeriodStart: 'desc',
      },
    });
  }

  /**
   * Calculate pay period week (Sunday to Saturday)
   */
  private calculatePayPeriodWeek(date: Date): Date {
    const payPeriodStart = new Date(date);
    const daysToSunday = payPeriodStart.getDay(); // 0 = Sunday, 1 = Monday, etc.
    payPeriodStart.setDate(date.getDate() - daysToSunday);
    payPeriodStart.setHours(0, 0, 0, 0);
    return payPeriodStart;
  }

  /**
   * Get compliance status for payment processing
   */
  async getPaymentComplianceStatus(providerId: string, payPeriodWeek?: Date) {
    const targetPayPeriod = payPeriodWeek || this.calculatePayPeriodWeek(new Date());
    
    const sessions = await this.prisma.appointment.findMany({
      where: {
        providerId,
        hasSession: true,
      },
    });

    const totalSessions = sessions.length;
    const signedSessions = sessions.filter(s => s.status === 'Completed').length;

    const deadline = this.getNoteDeadline(targetPayPeriod);
    const isDeadlinePassed = new Date() > deadline;

    return {
      payPeriodWeek: targetPayPeriod,
      totalSessions,
      signedSessions,
      completionRate: totalSessions > 0 ? (signedSessions / totalSessions) * 100 : 0,
      deadline,
      isDeadlinePassed,
      canProcessPayment: signedSessions > 0 && !isDeadlinePassed,
    };
  }

  /**
   * Get note deadline for a pay period
   */
  private getNoteDeadline(payPeriodWeek: Date): Date {
    const deadline = new Date(payPeriodWeek);
    deadline.setDate(payPeriodWeek.getDate() + 6); // Saturday
    deadline.setHours(23, 59, 59, 999);
    return deadline;
  }
}
