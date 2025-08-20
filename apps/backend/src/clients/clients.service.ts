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

  async findAll() {
    return this.prisma.client.findMany({
      where: {
        isActive: true,
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

  async findOne(id: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    await this.findOne(id); // Check if client exists

    return this.prisma.client.update({
      where: { id },
      data: updateClientDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if client exists

    return this.prisma.client.delete({
      where: { id },
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
    });
  }

  async updateClientInsurance(clientId: string, insurance: any[]) {
    // Delete existing insurance
    await this.prisma.clientInsurance.deleteMany({
      where: { clientId },
    });

    // Create new insurance
    if (insurance.length > 0) {
      return this.prisma.clientInsurance.createMany({
        data: insurance.map(ins => ({
          clientId,
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

    return { count: 0 };
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
      // Convert date fields
      const mappedClientData = {
        ...clientData,
        dateOfBirth: this.convertDate(clientData.dateOfBirth),
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
      await prisma.clientInsurance.deleteMany({
        where: { clientId },
      });
      if (insuranceInfo.length > 0) {
        await prisma.clientInsurance.createMany({
          data: insuranceInfo.map(ins => ({
            clientId,
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