import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ComplianceService {
  constructor(private readonly prisma: PrismaService) {}

  async getComplianceDashboard() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get compliance deadlines
    const deadlines = await this.prisma.complianceDeadline.findMany({
      where: {
        deadlineDate: {
          gte: thirtyDaysAgo,
        },
      },
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

    // Get time entries
    const timeEntries = await this.prisma.timeEntry.findMany({
      where: {
        entryDate: {
          gte: thirtyDaysAgo,
        },
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get appointments with sessions
    const sessionCompletions = await this.prisma.appointment.findMany({
      where: {
        hasSession: true,
        startTime: {
          gte: thirtyDaysAgo,
        },
      },
      include: {
        provider: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        clients: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        startTime: 'desc',
      },
    });

    // Calculate statistics
    const totalDeadlines = deadlines.length;
    const metDeadlines = deadlines.filter(d => d.isMet).length;
    const overdueDeadlines = deadlines.filter(d => !d.isMet && d.deadlineDate < now).length;

    const totalTimeEntries = timeEntries.length;
    const approvedTimeEntries = timeEntries.filter(t => t.isApproved).length;
    const pendingTimeEntries = timeEntries.filter(t => !t.isApproved).length;

    const totalSessions = sessionCompletions.length;

    return {
      deadlines: {
        total: totalDeadlines,
        met: metDeadlines,
        overdue: overdueDeadlines,
        pending: totalDeadlines - metDeadlines - overdueDeadlines,
        recent: deadlines.slice(0, 5),
      },
      timeTracking: {
        total: totalTimeEntries,
        approved: approvedTimeEntries,
        pending: pendingTimeEntries,
        recent: timeEntries.slice(0, 5),
      },
      sessionCompletions: {
        total: totalSessions,
        recent: sessionCompletions.slice(0, 5),
      },
    };
  }

  async getComplianceOverview() {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get overdue deadlines
    const overdueDeadlines = await this.prisma.complianceDeadline.findMany({
      where: {
        isMet: false,
        deadlineDate: {
          lt: now,
        },
      },
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

    // Get pending time entries
    const pendingTimeEntries = await this.prisma.timeEntry.findMany({
      where: {
        isApproved: false,
        entryDate: {
          gte: sevenDaysAgo,
        },
      },
      include: {
        user: {
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

    // Get unsigned sessions
    const unsignedSessions = await this.prisma.appointment.findMany({
      where: {
        hasSession: true,
        startTime: {
          gte: sevenDaysAgo,
        },
      },
      include: {
        provider: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        clients: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        startTime: 'desc',
      },
    });

    return {
      overdueDeadlines: overdueDeadlines.length,
      pendingTimeEntries: pendingTimeEntries.length,
      unsignedSessions: unsignedSessions.length,
      urgentItems: [
        ...overdueDeadlines.slice(0, 3),
        ...pendingTimeEntries.slice(0, 3),
        ...unsignedSessions.slice(0, 3),
      ],
    };
  }

  async getComplianceMetrics(userId: string) {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get compliance deadlines for the user
    const deadlines = await this.prisma.complianceDeadline.findMany({
      where: {
        providerId: userId,
        deadlineDate: {
          gte: thirtyDaysAgo,
        },
      },
    });

    // Get time entries for the user
    const timeEntries = await this.prisma.timeEntry.findMany({
      where: {
        userId: userId,
        entryDate: {
          gte: thirtyDaysAgo,
        },
      },
    });

    // Get session completions for the user
    const sessionCompletions = await this.prisma.appointment.findMany({
      where: {
        providerId: userId,
        hasSession: true,
        startTime: {
          gte: thirtyDaysAgo,
        },
      },
    });

    // Calculate metrics
    const totalDeadlines = deadlines.length;
    const metDeadlines = deadlines.filter(d => d.isMet).length;
    const overdueDeadlines = deadlines.filter(d => !d.isMet && d.deadlineDate < now).length;
    const completionRate = totalDeadlines > 0 ? (metDeadlines / totalDeadlines) * 100 : 0;
    const overdueRate = totalDeadlines > 0 ? (overdueDeadlines / totalDeadlines) * 100 : 0;

    // Calculate average completion time (in days)
    const completedDeadlines = deadlines.filter(d => d.isMet);
    let avgCompletionTime = 0;
    if (completedDeadlines.length > 0) {
      const totalCompletionTime = completedDeadlines.reduce((sum, deadline) => {
        const completionDate = deadline.updatedAt;
        const deadlineDate = deadline.deadlineDate;
        const daysDiff = Math.ceil((completionDate.getTime() - deadlineDate.getTime()) / (1000 * 60 * 60 * 24));
        return sum + Math.max(0, daysDiff); // Only count positive days (completed on time or early)
      }, 0);
      avgCompletionTime = totalCompletionTime / completedDeadlines.length;
    }

    return {
      completion_rate: Math.round(completionRate * 100) / 100, // Round to 2 decimal places
      overdue_rate: Math.round(overdueRate * 100) / 100,
      avg_completion_time: Math.round(avgCompletionTime * 100) / 100,
    };
  }

  async getPaymentCalculations(status?: string, period?: string) {
    let whereClause: any = {};

    // Filter by status
    if (status && status !== 'all') {
      whereClause.status = status;
    }

    // Filter by period
    if (period && period !== 'all') {
      const now = new Date();
      if (period === 'current') {
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        whereClause.payPeriodStart = {
          gte: startOfWeek,
        };
      } else if (period === 'last_month') {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        whereClause.payPeriodStart = {
          gte: lastMonth,
        };
      }
    }

    const paymentCalculations = await this.prisma.paymentCalculation.findMany({
      where: whereClause,
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

    return paymentCalculations;
  }

  async getComplianceReports(timeRange: number = 30, reportType: string = 'overview') {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - timeRange);

    // Fetch comprehensive data for reporting
    const [paymentData, sessionData, timeData, complianceData] = await Promise.all([
      this.prisma.paymentCalculation.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
      
      this.prisma.appointment.findMany({
        where: {
          hasSession: true,
          startTime: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          provider: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      
      this.prisma.timeEntry.findMany({
        where: {
          entryDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      
      this.prisma.complianceDeadline.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
    ]);

    // Calculate metrics
    const totalPayroll = paymentData.reduce((sum, payment) => sum + parseFloat(payment.grossAmount.toString()), 0);
    const totalSessions = sessionData.length;
    // Group data for charts
    const dailyPayroll = paymentData.reduce((acc: any, payment) => {
      const date = payment.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, amount: 0, count: 0 };
      }
      acc[date].amount += parseFloat(payment.grossAmount.toString());
      acc[date].count += 1;
      return acc;
    }, {});

    const payrollTrend = Object.values(dailyPayroll).sort((a: any, b: any) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Provider performance
    const providerStats = sessionData.reduce((acc: any, session) => {
      const providerId = session.providerId;
      const providerName = `${session.provider?.firstName} ${session.provider?.lastName}`;
      
      if (!acc[providerId]) {
        acc[providerId] = {
          name: providerName,
          totalSessions: 0,
          signedSessions: 0,
          earnings: 0
        };
      }
      
      acc[providerId].totalSessions += 1;
      if (session.calculatedAmount) {
        acc[providerId].earnings += parseFloat(session.calculatedAmount.toString());
      }
      
      return acc;
    }, {});

    const providerPerformance = Object.values(providerStats).map((provider: any) => ({
      ...provider,
      complianceRate: provider.totalSessions > 0 ? (provider.signedSessions / provider.totalSessions) * 100 : 0
    }));

    return {
      totalPayroll,
      totalSessions,
      payrollTrend,
      providerPerformance,
      paymentData,
      sessionData,
      timeData,
      complianceData
    };
  }

  async getStaffProviders() {
    // Get all users who have staff profiles
    const staffUsers = await this.prisma.user.findMany({
      where: {
        staffId: {
          not: null,
        },
        isActive: true,
      },
      include: {
        staffProfile: {
          select: {
            jobTitle: true,
          },
        },
      },
      orderBy: {
        firstName: 'asc',
      },
    });

    return staffUsers.map(user => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      jobTitle: user.staffProfile?.jobTitle || 'Staff Member',
    }));
  }
} 