import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getExecutiveDashboard(timeRange: string = '30') {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(timeRange));

    // Get payments for revenue data
    const payments = await this.prisma.payment.findMany({
      where: {
        paymentDate: {
          gte: daysAgo,
        },
      },
      select: {
        paymentAmount: true,
        paymentDate: true,
      },
    });

    // Get clients count
    const clients = await this.prisma.client.findMany({
      where: {
        createdAt: {
          gte: daysAgo,
        },
      },
      select: {
        id: true,
        createdAt: true,
        dateOfBirth: true,
      },
    });

    // Get appointments
    const appointments = await this.prisma.appointment.findMany({
      where: {
        startTime: {
          gte: daysAgo,
        },
      },
      select: {
        id: true,
        status: true,
        startTime: true,
      },
    });

    // Get notes
    const notes = await this.prisma.clinicalNote.findMany({
      where: {
        createdAt: {
          gte: daysAgo,
        },
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
      },
    });

    // Calculate metrics
    const totalRevenue = payments.reduce((sum, p) => sum + Number(p.paymentAmount || 0), 0);
    const totalPatients = clients.length;
    const completedAppointments = appointments.filter(a => a.status === 'completed').length;
    const completedNotes = notes.filter(n => n.status === 'signed').length;

    // Create revenue trend data
    const revenueData = [];
    for (let i = parseInt(timeRange) - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayPayments = payments.filter(p => 
        new Date(p.paymentDate).toDateString() === date.toDateString()
      );
      const dayRevenue = dayPayments.reduce((sum, p) => sum + Number(p.paymentAmount || 0), 0);
      
      revenueData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: dayRevenue
      });
    }

    // Calculate patient demographics
    const patientDemographics = this.calculatePatientDemographics(clients);

    // Get provider utilization
    const providerUtilization = await this.getProviderUtilization(daysAgo);

    return {
      totalRevenue,
      revenueChange: 5.2, // Mock data for now
      totalPatients,
      patientsChange: 3.1, // Mock data for now
      appointmentsCompleted: completedAppointments,
      appointmentsChange: 2.8, // Mock data for now
      notesCompleted: completedNotes,
      notesChange: 4.5, // Mock data for now
      revenueData,
      patientDemographics,
      providerUtilization,
    };
  }

  async getClinicalReports(timeRange: string = '30', providerFilter?: string) {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(timeRange));

    // Get notes data
    const notes = await this.prisma.clinicalNote.findMany({
      where: {
        createdAt: {
          gte: daysAgo,
        },
        ...(providerFilter && { providerId: providerFilter }),
      },
      select: {
        id: true,
        status: true,
        noteType: true,
        createdAt: true,
        signedAt: true,
      },
    });

    const totalNotes = notes.length;
    const completedNotes = notes.filter(n => n.status === 'signed').length;
    const overdueNotes = notes.filter(n => {
      if (n.status === 'signed') return false;
      const daysOld = (Date.now() - new Date(n.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      return daysOld > 7; // Consider notes overdue after 7 days
    }).length;

    // Calculate average completion time
    const signedNotes = notes.filter(n => n.signedAt && n.createdAt);
    const avgCompletionTime = signedNotes.length > 0 
      ? signedNotes.reduce((sum, note) => {
          const completionTime = (new Date(note.signedAt!).getTime() - new Date(note.createdAt).getTime()) / (1000 * 60 * 60);
          return sum + completionTime;
        }, 0) / signedNotes.length
      : 0;

    const complianceRate = totalNotes > 0 ? (completedNotes / totalNotes) * 100 : 0;

    // Group notes by type
    const notesByType = notes.reduce((acc: any[], note) => {
      const existing = acc.find(item => item.type === note.noteType);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ type: note.noteType, count: 1 });
      }
      return acc;
    }, []);

    // Add percentage to notesByType
    notesByType.forEach(item => {
      item.percentage = totalNotes > 0 ? Math.round((item.count / totalNotes) * 100) : 0;
    });

    // Get provider productivity
    const providerProductivity = await this.getProviderProductivity(daysAgo, providerFilter);

    // Get diagnosis distribution
    const diagnosisDistribution = await this.getDiagnosisDistribution(daysAgo);

    return {
      totalNotes,
      notesCompleted: completedNotes,
      notesOverdue: overdueNotes,
      avgCompletionTime,
      complianceRate,
      notesByType,
      providerProductivity,
      diagnosisDistribution,
    };
  }

  async getStaffReports(timeRange: string = '30') {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(timeRange));

    // Get users with clinician role
    const users = await this.prisma.user.findMany({
      where: {
        isActive: true,
        userRoles: {
          some: {
            role: 'Clinician',
            isActive: true,
          },
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    // Mock staff productivity data based on actual users
    const staffProductivity = users.map(user => ({
      name: `${user.firstName} ${user.lastName}`,
      totalSessions: Math.floor(Math.random() * 50) + 20,
      totalRevenue: Math.floor(Math.random() * 10000) + 5000,
      avgSessionLength: Math.floor(Math.random() * 30) + 45,
      complianceRate: Math.floor(Math.random() * 20) + 80
    }));

    return {
      staffProductivity,
      totalStaff: users.length,
      avgCompliance: staffProductivity.length > 0 
        ? staffProductivity.reduce((acc, p) => acc + p.complianceRate, 0) / staffProductivity.length 
        : 0
    };
  }

  async getBillingReports(timeRange: string = '30') {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(timeRange));

    // Get claims data
    const claims = await this.prisma.claim.findMany({
      where: {
        serviceDate: {
          gte: daysAgo,
        },
      },
      select: {
        id: true,
        status: true,
        totalAmount: true,
        serviceDate: true,
      },
    });

    // Get payments data
    const payments = await this.prisma.payment.findMany({
      where: {
        paymentDate: {
          gte: daysAgo,
        },
      },
      select: {
        id: true,
        paymentAmount: true,
        paymentDate: true,
      },
    });

    const totalClaims = claims.length;
    const totalRevenue = payments.reduce((sum, p) => sum + Number(p.paymentAmount), 0);
    const paidClaims = claims.filter(c => c.status === 'paid').length;
    const deniedClaims = claims.filter(c => c.status === 'denied').length;

    // Create revenue by month data
    const revenueByMonth = payments.reduce((acc: any, payment) => {
      const month = new Date(payment.paymentDate).toLocaleDateString('en-US', { month: 'short' });
      acc[month] = (acc[month] || 0) + Number(payment.paymentAmount);
      return acc;
    }, {});

    return {
      totalClaims,
      totalRevenue,
      paidClaims,
      deniedClaims,
      collectionRate: totalClaims > 0 ? (paidClaims / totalClaims) * 100 : 0,
      denialRate: totalClaims > 0 ? (deniedClaims / totalClaims) * 100 : 0,
      revenueByMonth,
    };
  }

  async getSchedulingReports(timeRange: string = '30') {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(timeRange));

    const appointments = await this.prisma.appointment.findMany({
      where: {
        startTime: {
          gte: daysAgo,
        },
      },
      select: {
        id: true,
        status: true,
        startTime: true,
      },
    });

    const totalAppointments = appointments.length;
    const completedAppointments = appointments.filter(a => a.status === 'completed').length;
    const cancelledAppointments = appointments.filter(a => a.status === 'cancelled').length;
    const noShowAppointments = appointments.filter(a => a.status === 'no_show').length;

    // Create utilization by day data
    const utilizationByDay = appointments.reduce((acc: any, appt) => {
      const day = new Date(appt.startTime).toLocaleDateString('en-US', { weekday: 'short' });
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});

    return {
      totalAppointments,
      completedAppointments,
      cancelledAppointments,
      noShowAppointments,
      completionRate: totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0,
      noShowRate: totalAppointments > 0 ? (noShowAppointments / totalAppointments) * 100 : 0,
      utilizationByDay,
    };
  }

  private calculatePatientDemographics(clients: any[]) {
    const now = new Date();
    const ageGroups = {
      '18-30': 0,
      '31-50': 0,
      '51-70': 0,
      '71+': 0,
    };

    clients.forEach(client => {
      if (client.dateOfBirth) {
        const age = now.getFullYear() - new Date(client.dateOfBirth).getFullYear();
        if (age >= 18 && age <= 30) ageGroups['18-30']++;
        else if (age >= 31 && age <= 50) ageGroups['31-50']++;
        else if (age >= 51 && age <= 70) ageGroups['51-70']++;
        else if (age > 70) ageGroups['71+']++;
      }
    });

    return Object.entries(ageGroups).map(([age_group, count]) => ({ age_group, count }));
  }

  private async getProviderUtilization(daysAgo: Date) {
    // Mock provider utilization data
    return [
      { provider_name: 'Dr. Smith', utilization: 85 },
      { provider_name: 'Dr. Jones', utilization: 92 },
      { provider_name: 'Dr. Brown', utilization: 78 }
    ];
  }

  private async getProviderProductivity(daysAgo: Date, providerFilter?: string) {
    // Mock provider productivity data
    return [
      { provider: 'Dr. Smith', notes: 45, avg_time: 2.5 },
      { provider: 'Dr. Jones', notes: 38, avg_time: 2.8 },
      { provider: 'Dr. Brown', notes: 32, avg_time: 2.2 }
    ];
  }

  private async getDiagnosisDistribution(daysAgo: Date) {
    // Mock diagnosis distribution data
    return [
      { diagnosis: 'Anxiety Disorders', count: 45 },
      { diagnosis: 'Depression', count: 38 },
      { diagnosis: 'ADHD', count: 32 },
      { diagnosis: 'PTSD', count: 25 },
      { diagnosis: 'Other', count: 15 }
    ];
  }
} 