import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

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

      // Create a user record for the client
      const clientUser = await prisma.user.create({
        data: {
          email: createClientDto.email || `client.${client.id}@example.com`,
          firstName: createClientDto.firstName,
          lastName: createClientDto.lastName,
          middleName: createClientDto.middleName,
          suffix: createClientDto.suffix,
          userName: `${createClientDto.firstName.toLowerCase()}.${createClientDto.lastName.toLowerCase()}`,
          isActive: true,
          clientId: client.id,
        },
      });

      return { ...client, userId: clientUser.id };
    });
  }

  async findAll(): Promise<any[]> {
    return this.prisma.client.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        lastName: 'asc',
      },
    });
  }

  // Get clients for admin roles (full access)
  async findAllForAdmin(): Promise<any[]> {
    return this.prisma.client.findMany({
      where: {
        isActive: true,
      },
      include: {
        assignedClinician: {
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
      orderBy: {
        lastName: 'asc',
      },
    });
  }

  // Get clients assigned to a specific clinician
  async findClientsByClinicianId(clinicianId: string): Promise<any[]> {
    return this.prisma.client.findMany({
      where: {
        isActive: true,
        assignedClinicianId: clinicianId,
      },
      include: {
        assignedClinician: {
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
      orderBy: {
        lastName: 'asc',
      },
    });
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

    return this.prisma.client.findMany({
      where: {
        isActive: true,
        assignedClinicianId: { in: allStaffIds },
      },
      include: {
        assignedClinician: {
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
      orderBy: {
        lastName: 'asc',
      },
    });
  }

  async getClientsForNotes() {
    return this.prisma.client.findMany({
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
  }

  async findOne(id: string): Promise<any> {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: {
        assignedClinician: {
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
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    await this.findOne(id); // Check if client exists

    // Handle assignedClinician relation properly
    const { assignedClinicianId, ...otherData } = updateClientDto;
    const updateData = {
      ...otherData,
      assignedClinician: assignedClinicianId 
        ? { connect: { id: assignedClinicianId } }
        : assignedClinicianId === null 
          ? { disconnect: true }
          : undefined,
    };

    return this.prisma.client.update({
      where: { id },
      data: updateData,
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

      // Create a user record for the client
      const clientUser = await prisma.user.create({
        data: {
          email: clientData.email || `client.${client.id}@example.com`,
          firstName: clientData.firstName,
          lastName: clientData.lastName,
          middleName: clientData.middleName,
          suffix: clientData.suffix,
          userName: `${clientData.firstName.toLowerCase()}.${clientData.lastName.toLowerCase()}`,
          isActive: true,
          clientId: client.id,
        },
      });

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
      // Convert date fields and handle assignedClinician relation
      const { assignedClinicianId, ...otherClientData } = clientData;
      const mappedClientData = {
        ...otherClientData,
        dateOfBirth: this.convertDate(clientData.dateOfBirth),
        // Use relation field syntax for updates
        assignedClinician: assignedClinicianId 
          ? { connect: { id: assignedClinicianId } }
          : { disconnect: true },
      };
      // Update the client
      const client = await prisma.client.update({
        where: { id: clientId },
        data: mappedClientData,
      });
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
}