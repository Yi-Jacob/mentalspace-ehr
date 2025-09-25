import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { EmailService } from '../common/email.service';
import { AuthService } from '../auth/auth.service';

/**
 * Interface representing client data returned for note creation workflows.
 * Contains minimal client information optimized for note and messaging features.
 */
export interface ClientNoteData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

@Injectable()
export class ClientsService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private authService: AuthService,
  ) {}

  // Utility function to convert date strings to Date objects
  private convertDate(dateString: string | undefined | null): Date | undefined {
    if (!dateString || dateString === '') return undefined;
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? undefined : date;
    } catch {
      return undefined;
    }
  }

  async create(createClientDto: CreateClientDto) {
    return this.prisma.$transaction(async (prisma) => {
      // Create the client
      const client = await prisma.client.create({
        data: createClientDto,
      });

      // Create a user record for the client without password
      const clientUser = await prisma.user.create({
        data: {
          email: createClientDto.email,
          password: null, // No password set initially
          firstName: createClientDto.firstName,
          lastName: createClientDto.lastName,
          middleName: createClientDto.middleName,
          suffix: createClientDto.suffix,
          userName: `${createClientDto.firstName.toLowerCase()}.${createClientDto.lastName.toLowerCase()}`,
          isActive: true,
          clientId: client.id,
        },
      });

      // Create user role for the client
      await prisma.userRole.create({
        data: {
          userId: clientUser.id,
          role: 'Patient',
          assignedAt: new Date(),
          isActive: true,
        }
      });

      // Generate password reset token for the new client
      const passwordResetData = await this.authService.createPasswordResetToken(clientUser.id);

      // Send password setup email to the client
      if (createClientDto.email) {
        try {
          await this.emailService.sendPasswordSetupEmail(
            createClientDto.email,
            createClientDto.firstName,
            createClientDto.lastName,
            passwordResetData.resetUrl,
          );
        } catch (error) {
          console.error('Failed to send password setup email:', error);
          // Don't fail the client creation if email fails
        }
      }

      return { ...client, userId: clientUser.id };
    });
  }

  // Get clients for admin roles (full access)
  async findAllForAdmin(): Promise<any[]> {
    const clients = await this.prisma.client.findMany({
      where: {
        isActive: true,
      },
      include: {
        clinicians: {
          include: {
            clinician: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            password: true,
          },
        },
      },
      orderBy: {
        lastName: 'asc',
      },
    });

    // Transform the data to include hasPassword
    return clients.map(client => ({
      ...client,
      hasPassword: client.user?.password ? client.user.password.trim() !== '' : false,
      user: undefined, // Remove the user object to avoid exposing password
    }));
  }

  // Get clients assigned to a specific clinician
  async findClientsByClinicianId(clinicianId: string): Promise<any[]> {
    const clients = await this.prisma.client.findMany({
      where: {
        isActive: true,
        clinicians: {
          some: {
            clinicianId: clinicianId,
          },
        },
      },
      include: {
        clinicians: {
          include: {
            clinician: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            password: true,
          },
        },
      },
      orderBy: {
        lastName: 'asc',
      },
    });

    // Transform the data to include hasPassword
    return clients.map(client => ({
      ...client,
      hasPassword: client.user?.password ? client.user.password.trim() !== '' : false,
      user: undefined, // Remove the user object to avoid exposing password
    }));
  }

  // Get clients for supervisor (own clients + supervisee clients)
  async findClientsForSupervisor(supervisorId: string): Promise<any[]> {
    // Get supervisee IDs
    const supervisionRelationships = await this.prisma.supervisionRelationship.findMany({
      where: {
        supervisorId: supervisorId,
        status: 'active',
      },
      select: {
        superviseeId: true,
      },
    });

    const superviseeIds = supervisionRelationships.map(rel => rel.superviseeId);
    
    // Get staff profile IDs for supervisees
    const superviseeStaffProfiles = await this.prisma.staffProfile.findMany({
      where: {
        user: {
          id: { in: superviseeIds },
        },
      },
      select: {
        id: true,
      },
    });

    const superviseeStaffIds = superviseeStaffProfiles.map(staff => staff.id);
    
    // Get supervisor's own staff profile ID
    const supervisorStaffProfile = await this.prisma.staffProfile.findFirst({
      where: {
        user: {
          id: supervisorId,
        },
      },
      select: {
        id: true,
      },
    });

    // Combine supervisor's clients with supervisee clients
    const allStaffIds = superviseeStaffIds;
    if (supervisorStaffProfile) {
      allStaffIds.push(supervisorStaffProfile.id);
    }

    const clients = await this.prisma.client.findMany({
      where: {
        isActive: true,
        clinicians: {
          some: {
            clinicianId: { in: allStaffIds },
          },
        },
      },
      include: {
        clinicians: {
          include: {
            clinician: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            password: true,
          },
        },
      },
      orderBy: {
        lastName: 'asc',
      },
    });

    // Transform the data to include hasPassword
    return clients.map(client => ({
      ...client,
      hasPassword: client.user?.password ? client.user.password.trim() !== '' : false,
      user: undefined, // Remove the user object to avoid exposing password
    }));
  }

  /**
   * Retrieves clients assigned to the specified clinician for notes and messaging purposes.
   * 
   * This method filters clients based on the authenticated user's staff profile ID,
   * ensuring that clinicians only see clients assigned to them. The method performs
   * the following operations:
   * 1. Validates the user ID parameter
   * 2. Retrieves the staff profile associated with the user
   * 3. Queries for active clients assigned to that staff profile
   * 4. Returns a minimal client dataset optimized for note creation workflows
   * 
   * @param userId - The unique identifier of the authenticated user
   * @returns Promise<ClientNoteData[]> - Array of client data for notes, sorted by last name
   * @throws {Error} When userId is invalid or database operation fails
   * 
   * @example
   * ```typescript
   * const clients = await clientsService.getClientsForNotes('user-123');
   * // Returns: [{ id: 'client-1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' }]
   * ```
   */
  async getClientsForNotes(userId: string, userRoles?: string[]): Promise<ClientNoteData[]> {
    // Input validation
    if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
      throw new Error('Invalid user ID provided for client retrieval');
    }

    try {
      // Define admin roles (same as in controller)
      const adminRoles = ['Practice Administrator', 'Clinical Administrator', 'Practice Scheduler'];
      
      // Check if user has admin roles - return all active clients
      if (userRoles && userRoles.some(role => adminRoles.includes(role))) {
        const clients = await this.prisma.client.findMany({
          where: {
            isActive: true,
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
          orderBy: {
            lastName: 'asc',
          },
        });
        return clients;
      }

      // Retrieve the staff profile associated with the user
      const staffProfile = await this.getStaffProfileByUserId(userId.trim());
      
      if (!staffProfile) {
        // User doesn't have an associated staff profile - return empty array
        // This is a valid scenario for users without clinical roles
        return [];
      }

      // Query for active clients assigned to this clinician
      const clients = await this.prisma.client.findMany({
        where: {
          isActive: true,
          clinicians: {
            some: {
              clinicianId: staffProfile.id,
            },
          },
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
        orderBy: {
          lastName: 'asc',
        },
      });

      return clients;
    } catch (error) {
      // Log the error for debugging purposes
      console.error(`Error retrieving clients for notes for user ${userId}:`, error);
      throw new Error(`Failed to retrieve assigned clients: ${error.message}`);
    }
  }

  async findOne(id: string): Promise<any> {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: {
        clinicians: {
          include: {
            clinician: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    middleName: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    await this.findOne(id); // Check if client exists

    // Handle assignedClinicianIds relation properly
    const { assignedClinicianIds, ...otherData } = updateClientDto;
    
    return this.prisma.$transaction(async (prisma) => {
      // Update basic client data
      const updatedClient = await prisma.client.update({
        where: { id },
        data: otherData,
      });

      // Handle clinician assignments if provided
      if (assignedClinicianIds !== undefined) {
        // Remove all existing clinician assignments
        await prisma.clientClinician.deleteMany({
          where: { clientId: id },
        });

        // Add new clinician assignments
        if (assignedClinicianIds.length > 0) {
          await prisma.clientClinician.createMany({
            data: assignedClinicianIds.map(clinicianId => ({
              clientId: id,
              clinicianId: clinicianId,
            })),
          });
        }
      }

      return updatedClient;
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if client exists

    return this.prisma.client.delete({
      where: { id },
    });
  }

  async getStaffProfiles() {
    return this.prisma.staffProfile.findMany({
      where: {
        status: 'active', // Only get active staff
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
        user: {
          lastName: 'asc',
        },
      },
    });
  }

  // Get staff profile by user ID
  async getStaffProfileByUserId(userId: string) {
    return this.prisma.staffProfile.findFirst({
      where: {
        user: {
          id: userId,
        },
      },
      select: {
        id: true,
      },
    });
  }

  // Phone numbers
  async getClientPhoneNumbers(clientId: string) {
    return this.prisma.clientPhoneNumber.findMany({
      where: { clientId },
    });
  }

  async updateClientPhoneNumbers(clientId: string, phoneNumbers: any[]) {
    // Delete existing phone numbers
    await this.prisma.clientPhoneNumber.deleteMany({
      where: { clientId },
    });

    // Create new phone numbers
    if (phoneNumbers.length > 0) {
      return this.prisma.clientPhoneNumber.createMany({
        data: phoneNumbers.map(phone => ({
          clientId,
          phoneNumber: phone.number,
          phoneType: phone.type,
          messagePreference: phone.messagePreference,
        })),
      });
    }

    return { count: 0 };
  }

  // Emergency contacts
  async getClientEmergencyContacts(clientId: string) {
    return this.prisma.clientEmergencyContact.findMany({
      where: { clientId },
    });
  }

  async updateClientEmergencyContacts(clientId: string, contacts: any[]) {
    // Delete existing emergency contacts
    await this.prisma.clientEmergencyContact.deleteMany({
      where: { clientId },
    });

    // Create new emergency contacts
    if (contacts.length > 0) {
      return this.prisma.clientEmergencyContact.createMany({
        data: contacts.map(contact => ({
          clientId,
          name: contact.name,
          relationship: contact.relationship,
          phoneNumber: contact.phoneNumber,
          email: contact.email,
          isPrimary: contact.isPrimary,
        })),
      });
    }

    return { count: 0 };
  }

  // Insurance
  async getClientInsurance(clientId: string) {
    return this.prisma.clientInsurance.findMany({
      where: { clientId },
      include: {
        payer: {
          select: {
            id: true,
            name: true,
            payerType: true,
          },
        },
      },
    });
  }

  async updateClientInsurance(clientId: string, insurance: any[]) {
    return this.prisma.$transaction(async (prisma) => {
      // Get existing insurance records
      const existingInsurance = await prisma.clientInsurance.findMany({
        where: { clientId },
      });

      // Create maps for tracking
      const existingMap = new Map(existingInsurance.map(ins => [ins.id, ins]));
      const incomingMap = new Map(insurance.filter(ins => ins.id).map(ins => [ins.id, ins]));

      // Find records to delete (existing but not in incoming)
      const toDelete = existingInsurance.filter(ins => !incomingMap.has(ins.id));
      
      // Find records to update (existing and in incoming)
      const toUpdate = insurance.filter(ins => ins.id && existingMap.has(ins.id));
      
      // Find records to create (incoming but not existing)
      const toCreate = insurance.filter(ins => !ins.id || !existingMap.has(ins.id));
      
      // Delete records that are no longer needed
      if (toDelete.length > 0) {
        await prisma.clientInsurance.deleteMany({
          where: {
            id: { in: toDelete.map(ins => ins.id) },
          },
        });
      }
      
      // Update existing records
      for (const ins of toUpdate) {
        await prisma.clientInsurance.update({
          where: { id: ins.id },
          data: {
            payerId: ins.payerId || null,
            insuranceType: ins.insuranceType,
            insuranceCompany: ins.insuranceCompany,
            policyNumber: ins.policyNumber,
            groupNumber: ins.groupNumber,
            subscriberName: ins.subscriberName,
            subscriberRelationship: ins.subscriberRelationship,
            subscriberDob: this.convertDate(ins.subscriberDob),
            effectiveDate: this.convertDate(ins.effectiveDate),
            terminationDate: this.convertDate(ins.terminationDate),
            copayAmount: ins.copayAmount,
            deductibleAmount: ins.deductibleAmount,
          },
        });
      }

      // Create new records
      if (toCreate.length > 0) {
        await prisma.clientInsurance.createMany({
          data: toCreate.map(ins => ({
            clientId,
            payerId: ins.payerId || null,
            insuranceType: ins.insuranceType,
            insuranceCompany: ins.insuranceCompany,
            policyNumber: ins.policyNumber,
            groupNumber: ins.groupNumber,
            subscriberName: ins.subscriberName,
            subscriberRelationship: ins.subscriberRelationship,
            subscriberDob: this.convertDate(ins.subscriberDob),
            effectiveDate: this.convertDate(ins.effectiveDate),
            terminationDate: this.convertDate(ins.terminationDate),
            copayAmount: ins.copayAmount,
            deductibleAmount: ins.deductibleAmount,
          })),
        });
      }

      return {
        deleted: toDelete.length,
        updated: toUpdate.length,
        created: toCreate.length,
      };
    });
  }

  // Primary care provider
  async getClientPrimaryCareProvider(clientId: string) {
    return this.prisma.clientPrimaryCareProvider.findFirst({
      where: { clientId },
    });
  }

  async updateClientPrimaryCareProvider(clientId: string, pcp: any) {
    // Delete existing PCP
    await this.prisma.clientPrimaryCareProvider.deleteMany({
      where: { clientId },
    });

    // Create new PCP
    if (pcp && pcp.providerName) {
      return this.prisma.clientPrimaryCareProvider.create({
        data: {
          clientId,
          providerName: pcp.providerName,
          practiceName: pcp.practiceName,
          phoneNumber: pcp.phoneNumber,
          address: pcp.address,
        },
      });
    }

    return null;
  }

  // Create client with all related data
  async createClientWithFormData(
    clientData: any,
    phoneNumbers: any[],
    emergencyContacts: any[],
    insuranceInfo: any[],
    primaryCareProvider: any,
  ) {
    return this.prisma.$transactionWithRetry(async (prisma) => {
      // Convert date fields
      const mappedClientData = {
        ...clientData,
        dateOfBirth: this.convertDate(clientData.dateOfBirth),
      };

      // Create the client
      const client = await prisma.client.create({
        data: mappedClientData,
      });

      // Create a user record for the client without password
      const clientUser = await prisma.user.create({
        data: {
          email: clientData.email || `client.${client.id}@example.com`,
          password: null, // No password set initially
          firstName: clientData.firstName,
          lastName: clientData.lastName,
          middleName: clientData.middleName,
          suffix: clientData.suffix,
          userName: `${clientData.firstName.toLowerCase()}.${clientData.lastName.toLowerCase()}`,
          isActive: true,
          clientId: client.id,
        },
      });

      // Generate password reset token for the new client
      const passwordResetData = await this.authService.createPasswordResetToken(clientUser.id);

      // Send password setup email to the client
      if (clientData.email) {
        try {
          await this.emailService.sendPasswordSetupEmail(
            clientData.email,
            clientData.firstName,
            clientData.lastName,
            passwordResetData.resetUrl,
          );
        } catch (error) {
          console.error('Failed to send password setup email:', error);
          // Don't fail the client creation if email fails
        }
      }

      // Create phone numbers
      if (phoneNumbers.length > 0) {
        await prisma.clientPhoneNumber.createMany({
          data: phoneNumbers.map(phone => ({
            clientId: client.id,
            phoneNumber: phone.number,
            phoneType: phone.type,
            messagePreference: phone.messagePreference,
          })),
        });
      }

      // Create emergency contacts
      if (emergencyContacts.length > 0) {
        await prisma.clientEmergencyContact.createMany({
          data: emergencyContacts.map(contact => ({
            clientId: client.id,
            name: contact.name,
            relationship: contact.relationship,
            phoneNumber: contact.phoneNumber,
            email: contact.email,
            isPrimary: contact.isPrimary,
          })),
        });
      }

      // Create insurance
      if (insuranceInfo.length > 0) {
        await prisma.clientInsurance.createMany({
          data: insuranceInfo.map(ins => ({
            clientId: client.id,
            payerId: ins.payerId || null,
            insuranceType: ins.insuranceType,
            insuranceCompany: ins.insuranceCompany,
            policyNumber: ins.policyNumber,
            groupNumber: ins.groupNumber,
            subscriberName: ins.subscriberName,
            subscriberRelationship: ins.subscriberRelationship,
            subscriberDob: this.convertDate(ins.subscriberDob),
            effectiveDate: this.convertDate(ins.effectiveDate),
            terminationDate: this.convertDate(ins.terminationDate),
            copayAmount: ins.copayAmount,
            deductibleAmount: ins.deductibleAmount,
          })),
        });
      }

      // Create primary care provider
      if (primaryCareProvider && primaryCareProvider.providerName) {
        await prisma.clientPrimaryCareProvider.create({
          data: {
            clientId: client.id,
            providerName: primaryCareProvider.providerName,
            practiceName: primaryCareProvider.practiceName,
            phoneNumber: primaryCareProvider.phoneNumber,
            address: primaryCareProvider.address,
          },
        });
      }

      return { ...client, userId: clientUser.id };
    }, {
      timeout: 30000, // 30 seconds
      maxWait: 10000, // 10 seconds
      maxRetries: 3,
    });
  }

  // Update client with all related data
  async updateClientWithFormData(
    clientId: string,
    clientData: any,
    phoneNumbers: any[],
    emergencyContacts: any[],
    insuranceInfo: any[],
    primaryCareProvider: any,
  ) {
    return this.prisma.$transactionWithRetry(async (prisma) => {
      // Convert date fields and handle assignedClinicianIds relation
      // Also remove clinicians relationship data as it's handled separately
      const { assignedClinicianIds, clinicians, ...otherClientData } = clientData;
      const mappedClientData = {
        ...otherClientData,
        dateOfBirth: this.convertDate(clientData.dateOfBirth),
      };
      
      // Update the client
      const client = await prisma.client.update({
        where: { id: clientId },
        data: mappedClientData,
      });

      // Handle clinician assignments if provided
      if (assignedClinicianIds !== undefined) {
        // Remove all existing clinician assignments
        await prisma.clientClinician.deleteMany({
          where: { clientId: clientId },
        });

        // Add new clinician assignments
        if (assignedClinicianIds.length > 0) {
          await prisma.clientClinician.createMany({
            data: assignedClinicianIds.map(clinicianId => ({
              clientId: clientId,
              clinicianId: clinicianId,
            })),
          });
        }
      }
      // Update phone numbers
      await prisma.clientPhoneNumber.deleteMany({
        where: { clientId },
      });
      if (phoneNumbers.length > 0) {
        await prisma.clientPhoneNumber.createMany({
          data: phoneNumbers.map(phone => ({
            clientId,
            phoneNumber: phone.number,
            phoneType: phone.type,
            messagePreference: phone.messagePreference,
          })),
        });
      }
      // Update emergency contacts
      await prisma.clientEmergencyContact.deleteMany({
        where: { clientId },
      });
      if (emergencyContacts.length > 0) {
        await prisma.clientEmergencyContact.createMany({
          data: emergencyContacts.map(contact => ({
            clientId,
            name: contact.name,
            relationship: contact.relationship,
            phoneNumber: contact.phoneNumber,
            email: contact.email,
            isPrimary: contact.isPrimary,
          })),
        });
      }

      // Update insurance
      await this.updateClientInsurance(clientId, insuranceInfo);

      // Update primary care provider
      await prisma.clientPrimaryCareProvider.deleteMany({
        where: { clientId },
      });
      if (primaryCareProvider && primaryCareProvider.providerName) {
        await prisma.clientPrimaryCareProvider.create({
          data: {
            clientId,
            providerName: primaryCareProvider.providerName,
            practiceName: primaryCareProvider.practiceName,
            phoneNumber: primaryCareProvider.phoneNumber,
            address: primaryCareProvider.address,
          },
        });
      }

      return client;
    }, {
      timeout: 30000, // 30 seconds
      maxWait: 10000, // 10 seconds
      maxRetries: 3,
    });
  }

  async addClinicianToClient(clientId: string, clinicianId: string, assignedBy?: string) {
    const existingAssignment = await this.prisma.clientClinician.findUnique({
      where: {
        clientId_clinicianId: {
          clientId,
          clinicianId: clinicianId,
        },
      },
    });

    if (existingAssignment) {
      throw new Error('Clinician is already assigned to this client');
    }

    // Verify that the clinician exists
    const clinician = await this.prisma.staffProfile.findUnique({
      where: { id: clinicianId },
    });

    if (!clinician) {
      throw new Error('Clinician not found');
    }

    const assignment = await this.prisma.clientClinician.create({
      data: {
        clientId,
        clinicianId: clinicianId,
        assignedBy,
      },
      include: {
        clinician: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return assignment;
  }

  async removeClinicianFromClient(clientId: string, clinicianId: string) {
    const assignment = await this.prisma.clientClinician.findUnique({
      where: {
        clientId_clinicianId: {
          clientId,
          clinicianId: clinicianId,
        },
      },
    });

    if (!assignment) {
      throw new Error('Clinician assignment not found');
    }

    return this.prisma.clientClinician.delete({
      where: {
        clientId_clinicianId: {
          clientId,
          clinicianId: clinicianId,
        },
      },
    });
  }

  async getClientClinicians(clientId: string) {
    const assignments = await this.prisma.clientClinician.findMany({
      where: { clientId },
      include: {
        clinician: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        assignedAt: 'desc',
      },
    });

    return assignments.map(assignment => ({
      id: assignment.id,
      clientId: assignment.clientId,
      clinicianId: assignment.clinicianId,
      assignedAt: assignment.assignedAt.toISOString(),
      assignedBy: assignment.assignedBy,
      clinician: {
        id: assignment.clinician.id,
        user: assignment.clinician.user,
        jobTitle: assignment.clinician.jobTitle,
        department: assignment.clinician.department,
      },
    }));
  }

  async resendWelcomeEmail(clientId: string): Promise<{ success: boolean; message: string }> {
    try {
      // Get the client with user information
      const client = await this.prisma.client.findUnique({
        where: { id: clientId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              password: true,
            },
          },
        },
      });

      if (!client) {
        throw new Error('Client not found');
      }

      if (!client.user) {
        throw new Error('Client user account not found');
      }

      if (!client.user.email) {
        throw new Error('Client email not found');
      }

      // Generate new password reset token
      const passwordResetData = await this.authService.createPasswordResetToken(client.user.id);

      // Check if client has a password to determine email type
      const hasPassword = client.user.password && client.user.password.trim() !== '';

      if (hasPassword) {
        // Send password reset email
        await this.emailService.sendPasswordResetEmail(
          client.user.email,
          client.user.firstName,
          client.user.lastName,
          passwordResetData.resetUrl,
        );

        return {
          success: true,
          message: 'Password reset email sent successfully',
        };
      } else {
        // Send welcome email
        await this.emailService.sendPasswordSetupEmail(
          client.user.email,
          client.user.firstName,
          client.user.lastName,
          passwordResetData.resetUrl,
        );

        return {
          success: true,
          message: 'Welcome email sent successfully',
        };
      }
    } catch (error) {
      console.error('Error sending email:', error);
      return {
        success: false,
        message: error.message || 'Failed to send email',
      };
    }
  }
}