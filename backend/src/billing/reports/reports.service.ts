import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getBillingReports(timeRange: string) {
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalClaims = claims.length;
    const submittedClaims = claims.filter(c => c.status !== 'draft').length;
    const paidClaims = claims.filter(c => c.status === 'paid').length;
    const deniedClaims = claims.filter(c => c.status === 'denied').length;

    const statusCounts = claims.reduce((acc, claim) => {
      acc[claim.status] = (acc[claim.status] || 0) + 1;
      return acc;
    }, {});

    const statusData = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
    }));

    const agingData = claims.map(claim => {
      const daysSinceSubmission = claim.submissionDate 
        ? Math.floor((new Date().getTime() - new Date(claim.submissionDate).getTime()) / (1000 * 60 * 60 * 24))
        : 0;
      return { ...claim, daysSinceSubmission };
    });

    const agingBuckets = {
      '0-30 days': agingData.filter(c => c.daysSinceSubmission <= 30).length,
      '31-60 days': agingData.filter(c => c.daysSinceSubmission > 30 && c.daysSinceSubmission <= 60).length,
      '61-90 days': agingData.filter(c => c.daysSinceSubmission > 60 && c.daysSinceSubmission <= 90).length,
      '90+ days': agingData.filter(c => c.daysSinceSubmission > 90).length,
    };

    const agingChartData = Object.entries(agingBuckets).map(([range, count]) => ({
      range,
      count,
    }));

    return {
      totalClaims,
      submittedClaims,
      paidClaims,
      deniedClaims,
      statusData,
      agingChartData,
      recentClaims: claims.slice(0, 10),
    };
  }

  async getRevenueReports(timeRange: string) {
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

    const totalRevenue = payments.reduce((sum, payment) => sum + payment.paymentAmount, 0);
    const totalPayments = payments.length;
    const averagePayment = totalPayments > 0 ? totalRevenue / totalPayments : 0;

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
      totalRevenue,
      totalPayments,
      averagePayment,
      trendData,
      payerData,
    };
  }

  async getClaimsReports(timeRange: string) {
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      totalClaims: claims.length,
      claims,
    };
  }

  async getPaymentsReports(timeRange: string) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(timeRange));

    const payments = await this.prisma.payment.findMany({
      where: {
        paymentDate: {
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
        paymentDate: 'desc',
      },
    });

    return {
      totalPayments: payments.length,
      payments,
    };
  }

  async getVerificationReports(timeRange: string) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(timeRange));

    const verifications = await this.prisma.insuranceVerification.findMany({
      where: {
        verificationDate: {
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
        insurance: {
          select: {
            insuranceCompany: true,
            policyNumber: true,
          },
        },
      },
      orderBy: {
        verificationDate: 'desc',
      },
    });

    return {
      totalVerifications: verifications.length,
      verifications,
    };
  }
} 