import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { TodoFiltersDto, TodoType, TodoPriority, TodoStatus } from './dto/todo-filters.dto';
import { UpdateTodoStatusDto } from './dto/update-todo-status.dto';

interface User {
  id: string;
  email: string;
  userRoles?: { role: string }[];
  staffProfile?: {
    id: string;
    supervisorId?: string;
  };
  client?: {
    id: string;
  };
}

export interface TodoItem {
  id: string;
  type: TodoType;
  title: string;
  description: string;
  priority: TodoPriority;
  status: TodoStatus;
  dueDate?: Date;
  assignedTo?: string;
  assignedToName?: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

export interface AccountTodoItem extends TodoItem {
  type: TodoType.ACCOUNT;
  userId: string;
  userName: string;
  missingFields: string[];
  userType: 'staff' | 'client';
}

export interface PatientTodoItem extends TodoItem {
  type: TodoType.PATIENT;
  clientId: string;
  clientName: string;
  missingFields: string[];
  assignedClinicianId?: string;
  assignedClinicianName?: string;
}

export interface AppointmentTodoItem extends TodoItem {
  type: TodoType.APPOINTMENT;
  appointmentId: string;
  clientId: string;
  clientName: string;
  providerId: string;
  providerName: string;
  appointmentDate: Date;
  appointmentType: string;
  appointmentStatus: string;
}

export interface NoteTodoItem extends TodoItem {
  type: TodoType.NOTE;
  noteId: string;
  clientId: string;
  clientName: string;
  providerId: string;
  providerName: string;
  noteType: string;
  noteStatus: string;
  sessionDate: Date;
  daysOverdue?: number;
}

export interface TodoStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
  byType: Record<TodoType, number>;
  byPriority: Record<TodoPriority, number>;
}

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  async getAccountTodos(user: User): Promise<AccountTodoItem[]> {
    const userRole = user.userRoles?.[0]?.role;
    const todos: AccountTodoItem[] = [];

    // Get users to check based on role
    let usersToCheck: any[] = [];

    if (userRole === 'admin') {
      // Admin can see all active staff
      usersToCheck = await this.prisma.user.findMany({
        where: {
          isActive: true,
          staffProfile: {
            isNot: null,
          },
        },
        include: {
          staffProfile: true,
          userRoles: true,
        },
      });
    } else if (userRole === 'supervisor') {
      // Supervisor can see their supervisees
      const supervisees = await this.prisma.supervisionRelationship.findMany({
        where: {
          supervisorId: user.id,
          status: 'active',
        },
        include: {
          supervisee: {
            include: {
              staffProfile: true,
              userRoles: true,
            },
          },
        },
      });
      usersToCheck = supervisees.map(s => s.supervisee);
    } else {
      // Regular users can only see their own account
      usersToCheck = [user];
    }

    // Check each user for missing information
    for (const userToCheck of usersToCheck) {
      const missingFields: string[] = [];
      let priority: TodoPriority = TodoPriority.LOW;

      // Check basic user information
      if (!userToCheck.firstName) missingFields.push('First Name');
      if (!userToCheck.lastName) missingFields.push('Last Name');
      if (!userToCheck.email) missingFields.push('Email');

      // Check staff profile information if user is staff
      if (userToCheck.staffProfile) {
        if (!userToCheck.staffProfile.licenseNumber) missingFields.push('License Number');
        if (!userToCheck.staffProfile.licenseState) missingFields.push('License State');
        if (!userToCheck.staffProfile.licenseExpiryDate) missingFields.push('License Expiry Date');
        if (!userToCheck.staffProfile.phoneNumber) missingFields.push('Phone Number');
        if (!userToCheck.staffProfile.emergencyContactName) missingFields.push('Emergency Contact Name');
        if (!userToCheck.staffProfile.emergencyContactPhone) missingFields.push('Emergency Contact Phone');
        if (!userToCheck.staffProfile.address1) missingFields.push('Address');
        if (!userToCheck.staffProfile.city) missingFields.push('City');
        if (!userToCheck.staffProfile.state) missingFields.push('State');
        if (!userToCheck.staffProfile.zipCode) missingFields.push('Zip Code');
      }

      // Set priority based on missing fields
      if (missingFields.length > 5) priority = TodoPriority.URGENT;
      else if (missingFields.length > 3) priority = TodoPriority.HIGH;
      else if (missingFields.length > 1) priority = TodoPriority.MEDIUM;

      if (missingFields.length > 0) {
        todos.push({
          id: `account-${userToCheck.id}`,
          type: TodoType.ACCOUNT,
          title: `Complete ${userToCheck.firstName || 'User'}'s Profile`,
          description: `Missing ${missingFields.length} required fields: ${missingFields.join(', ')}`,
          priority,
          status: TodoStatus.PENDING,
          userId: userToCheck.id,
          userName: `${userToCheck.firstName || ''} ${userToCheck.lastName || ''}`.trim() || userToCheck.email,
          missingFields,
          userType: userToCheck.staffProfile ? 'staff' : 'client',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    return todos;
  }

  async getPatientTodos(user: User): Promise<PatientTodoItem[]> {
    const userRole = user.userRoles?.[0]?.role;
    const todos: PatientTodoItem[] = [];

    // Get clients to check based on role
    let clientsToCheck: any[] = [];

    if (userRole === 'admin') {
      // Admin can see all active clients
      clientsToCheck = await this.prisma.client.findMany({
        where: { isActive: true },
        include: {
          clinicians: {
            include: {
              clinician: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });
    } else if (userRole === 'supervisor') {
      // Supervisor can see clients of their supervisees
      const supervisees = await this.prisma.supervisionRelationship.findMany({
        where: {
          supervisorId: user.id,
          status: 'active',
        },
        include: {
          supervisee: {
            include: {
              staffProfile: {
                include: {
                  clients: {
                    include: {
                      client: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const clientIds = new Set<string>();
      supervisees.forEach(s => {
        s.supervisee.staffProfile?.clients.forEach(cc => {
          clientIds.add(cc.client.id);
        });
      });

      clientsToCheck = await this.prisma.client.findMany({
        where: {
          id: { in: Array.from(clientIds) },
          isActive: true,
        },
        include: {
          clinicians: {
            include: {
              clinician: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });
    } else {
      // Regular clinicians can see their assigned clients
      if (!user.staffProfile?.id) {
        // If user doesn't have a staff profile, return empty array
        clientsToCheck = [];
      } else {
        const staffProfile = await this.prisma.staffProfile.findUnique({
          where: { id: user.staffProfile.id },
          include: {
            clients: {  // ClientClinician[]
              include: {
                client: {  // Client
                  include: {
                    user: true,  // Direct user relationship
                  },
                },
              },
            },
          },
        });

        clientsToCheck = staffProfile?.clients.map(cc => cc.client) || [];
      }
    }

    // Check each client for missing information
    for (const client of clientsToCheck) {
      const missingFields: string[] = [];
      let priority: TodoPriority = TodoPriority.LOW;

      // Check basic client information
      if (!client.firstName) missingFields.push('First Name');
      if (!client.lastName) missingFields.push('Last Name');
      if (!client.dateOfBirth) missingFields.push('Date of Birth');
      if (!client.email) missingFields.push('Email');
      if (!client.address1) missingFields.push('Address');
      if (!client.city) missingFields.push('City');
      if (!client.state) missingFields.push('State');
      if (!client.zipCode) missingFields.push('Zip Code');
      if (!client.hipaaSigned) missingFields.push('HIPAA Consent');

      // Check phone numbers
      const phoneCount = await this.prisma.clientPhoneNumber.count({
        where: { clientId: client.id },
      });
      if (phoneCount === 0) missingFields.push('Phone Number');

      // Check insurance information
      const insuranceCount = await this.prisma.clientInsurance.count({
        where: { clientId: client.id, isActive: true },
      });
      if (insuranceCount === 0) missingFields.push('Insurance Information');

      // Check emergency contacts
      const emergencyContactCount = await this.prisma.clientEmergencyContact.count({
        where: { clientId: client.id },
      });
      if (emergencyContactCount === 0) missingFields.push('Emergency Contact');

      // Set priority based on missing fields
      if (missingFields.length > 5) priority = TodoPriority.URGENT;
      else if (missingFields.length > 3) priority = TodoPriority.HIGH;
      else if (missingFields.length > 1) priority = TodoPriority.MEDIUM;

      if (missingFields.length > 0) {
        const assignedClinician = client.clinicians[0]?.clinician;
        todos.push({
          id: `patient-${client.id}`,
          type: TodoType.PATIENT,
          title: `Complete ${client.firstName || 'Patient'}'s Information`,
          description: `Missing ${missingFields.length} required fields: ${missingFields.join(', ')}`,
          priority,
          status: TodoStatus.PENDING,
          clientId: client.id,
          clientName: `${client.firstName || ''} ${client.lastName || ''}`.trim() || 'Unknown Patient',
          missingFields,
          assignedClinicianId: assignedClinician?.id,
          assignedClinicianName: assignedClinician ? `${assignedClinician.user.firstName} ${assignedClinician.user.lastName}` : undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    return todos;
  }

  async getAppointmentTodos(user: User): Promise<AppointmentTodoItem[]> {
    const userRole = user.userRoles?.[0]?.role;
    const todos: AppointmentTodoItem[] = [];

    // Get upcoming appointments based on role
    let appointments: any[] = [];

    if (userRole === 'admin') {
      // Admin can see all upcoming appointments
      appointments = await this.prisma.appointment.findMany({
        where: {
          startTime: {
            gte: new Date(),
          },
          status: {
            in: ['Scheduled', 'Confirmed'],
          },
        },
        include: {
          clients: true,
          provider: true,
        },
        orderBy: {
          startTime: 'asc',
        },
        take: 20, // Limit to next 20 appointments
      });
    } else if (userRole === 'supervisor') {
      // Supervisor can see appointments of their supervisees
      const supervisees = await this.prisma.supervisionRelationship.findMany({
        where: {
          supervisorId: user.id,
          status: 'active',
        },
        include: {
          supervisee: {
            include: {
              staffProfile: true,
            },
          },
        },
      });

      const superviseeUserIds = supervisees.map(s => s.supervisee.id).filter(Boolean);

      appointments = await this.prisma.appointment.findMany({
        where: {
          providerId: { in: superviseeUserIds },
          startTime: {
            gte: new Date(),
          },
          status: {
            in: ['Scheduled', 'Confirmed'],
          },
        },
        include: {
          clients: true,
          provider: true,
        },
        orderBy: {
          startTime: 'asc',
        },
        take: 20,
      });
    } else {
      console.log(user.id, user.staffProfile?.id);
      // Regular users can see their own appointments
      if (!user.id) {
        // If user doesn't have a staff profile, return empty array
        appointments = [];
      } else {
        appointments = await this.prisma.appointment.findMany({
          where: {
            providerId: user.id,
            startTime: {
              gte: new Date(),
            },
            status: {
              in: ['Scheduled', 'Confirmed'],
            },
          },
          include: {
            clients: true,
            provider: true,
          },
          orderBy: {
            startTime: 'asc',
          },
          take: 20,
        });
      }
    }

    // Convert appointments to todo items
    for (const appointment of appointments) {
      const hoursUntilAppointment = (appointment.startTime.getTime() - new Date().getTime()) / (1000 * 60 * 60);
      let priority: TodoPriority = TodoPriority.LOW;

      if (hoursUntilAppointment < 2) priority = TodoPriority.URGENT;
      else if (hoursUntilAppointment < 24) priority = TodoPriority.HIGH;
      else if (hoursUntilAppointment < 72) priority = TodoPriority.MEDIUM;

      todos.push({
        id: `appointment-${appointment.id}`,
        type: TodoType.APPOINTMENT,
        title: `Upcoming Appointment: ${appointment.clients.firstName} ${appointment.clients.lastName}`,
        description: `${appointment.appointmentType} appointment scheduled for ${appointment.startTime.toLocaleDateString()} at ${appointment.startTime.toLocaleTimeString()}`,
        priority,
        status: TodoStatus.PENDING,
        appointmentId: appointment.id,
        clientId: appointment.clientId,
        clientName: `${appointment.clients.firstName} ${appointment.clients.lastName}`,
        providerId: appointment.providerId,
        providerName: `${appointment.provider.firstName} ${appointment.provider.lastName}`,
        appointmentDate: appointment.startTime,
        appointmentType: appointment.appointmentType,
        appointmentStatus: appointment.status,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return todos;
  }

  async getNoteTodos(user: User): Promise<NoteTodoItem[]> {
    const userRole = user.userRoles?.[0]?.role;
    const todos: NoteTodoItem[] = [];

    // Get notes that need attention based on role
    let notes: any[] = [];

    if (userRole === 'admin') {
      // Admin can see all unsigned notes
      notes = await this.prisma.clinicalNote.findMany({
        where: {
          status: {
            in: ['draft', 'pending_review'],
          },
        },
        include: {
          client: true,
          provider: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 50,
      });
    } else if (userRole === 'supervisor') {
      // Supervisor can see notes of their supervisees
      const supervisees = await this.prisma.supervisionRelationship.findMany({
        where: {
          supervisorId: user.id,
          status: 'active',
        },
        include: {
          supervisee: true,
        },
      });

      const superviseeIds = supervisees.map(s => s.supervisee.id);

      notes = await this.prisma.clinicalNote.findMany({
        where: {
          providerId: { in: superviseeIds },
          status: {
            in: ['draft', 'pending_review'],
          },
        },
        include: {
          client: true,
          provider: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 50,
      });
    } else {
      // Regular users can see their own notes
      notes = await this.prisma.clinicalNote.findMany({
        where: {
          providerId: user.id,
          status: {
            in: ['draft', 'pending_review'],
          },
        },
        include: {
          client: true,
          provider: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 50,
      });
    }

    // Convert notes to todo items
    for (const note of notes) {
      const daysSinceCreated = Math.floor((new Date().getTime() - note.createdAt.getTime()) / (1000 * 60 * 60 * 24));
      let priority: TodoPriority = TodoPriority.LOW;
      let daysOverdue: number | undefined;

      if (daysSinceCreated > 7) {
        priority = TodoPriority.URGENT;
        daysOverdue = daysSinceCreated - 7;
      } else if (daysSinceCreated > 3) {
        priority = TodoPriority.HIGH;
        daysOverdue = daysSinceCreated - 3;
      } else if (daysSinceCreated > 1) {
        priority = TodoPriority.MEDIUM;
      }

      todos.push({
        id: `note-${note.id}`,
        type: TodoType.NOTE,
        title: `Complete Note: ${note.client.firstName} ${note.client.lastName}`,
        description: `${note.noteType} note created ${daysSinceCreated} days ago - Status: ${note.status}`,
        priority,
        status: TodoStatus.PENDING,
        noteId: note.id,
        clientId: note.clientId,
        clientName: `${note.client.firstName} ${note.client.lastName}`,
        providerId: note.providerId,
        providerName: `${note.provider.firstName} ${note.provider.lastName}`,
        noteType: note.noteType,
        noteStatus: note.status,
        sessionDate: note.createdAt,
        daysOverdue,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return todos;
  }
}
