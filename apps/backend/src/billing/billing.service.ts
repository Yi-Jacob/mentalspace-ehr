import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService) {}

  async getBillingDashboard(timeRange: string) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(timeRange));

    const [claims, payments, payers] = await Promise.all([
      this.prisma.claim.findMany({
        where: {
          createdAt: {
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
          payer: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.payment.findMany({
        where: {
          paymentDate: {
            gte: startDate,
            lte: endDate,
          },
          status: 'completed',
        },
        include: {
          client: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          payer: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          paymentDate: 'desc',
        },
      }),
      this.prisma.payer.findMany({
        where: {
          isActive: true,
        },
        orderBy: {
          name: 'asc',
        },
      }),
    ]);

    const totalClaims = claims.length;
    const submittedClaims = claims.filter(c => c.status !== 'draft').length;
    const paidClaims = claims.filter(c => c.status === 'paid').length;
    const deniedClaims = claims.filter(c => c.status === 'denied').length;

    const totalRevenue = payments.reduce((sum, payment) => sum + payment.paymentAmount, 0);
    const totalPayments = payments.length;
    const averagePayment = totalPayments > 0 ? totalRevenue / totalPayments : 0;

    return {
      totalClaims,
      submittedClaims,
      paidClaims,
      deniedClaims,
      totalRevenue,
      totalPayments,
      averagePayment,
      recentClaims: claims.slice(0, 10),
      recentPayments: payments.slice(0, 10),
      payers,
    };
  }

  async getBillingOverview(timeRange: string) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(timeRange));

    const claims = await this.prisma.claim.findMany({
      where: {
        createdAt: {
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
        payer: {
          select: {
            name: true,
          },
        },
      },
    });

    const statusCounts = claims.reduce((acc, claim) => {
      acc[claim.status] = (acc[claim.status] || 0) + 1;
      return acc;
    }, {});

    const statusData = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
    }));

    return {
      statusData,
      totalClaims: claims.length,
    };
  }

  async getBillingMetrics(timeRange: string) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(timeRange));

    const payments = await this.prisma.payment.findMany({
      where: {
        paymentDate: {
          gte: startDate,
          lte: endDate,
        },
        status: 'completed',
      },
      include: {
        client: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        payer: {
          select: {
            name: true,
          },
        },
      },
    });

    const dailyRevenue = payments.reduce((acc, payment) => {
      const date = payment.paymentDate.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, revenue: 0, count: 0 };
      }
      acc[date].revenue += payment.paymentAmount;
      acc[date].count += 1;
      return acc;
    }, {});

    const trendData = Object.values(dailyRevenue).sort((a: any, b: any) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const payerRevenue = payments.reduce((acc, payment) => {
      const payerName = payment.payer?.name || 'Patient Pay';
      if (!acc[payerName]) {
        acc[payerName] = { name: payerName, revenue: 0, count: 0 };
      }
      acc[payerName].revenue += payment.paymentAmount;
      acc[payerName].count += 1;
      return acc;
    }, {});

    const payerData = Object.values(payerRevenue);

    return {
      trendData,
      payerData,
      totalRevenue: payments.reduce((sum, p) => sum + p.paymentAmount, 0),
      totalPayments: payments.length,
    };
  }
} 