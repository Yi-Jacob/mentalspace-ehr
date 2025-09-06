import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateStatementDto } from './dto/create-statement.dto';
import { UpdateStatementDto } from './dto/update-statement.dto';
import { Request } from 'express';

@Injectable()
export class StatementsService {
  constructor(private readonly prisma: PrismaService) {}

  private async getCurrentUserStaffProfile(userId: string): Promise<string | null> {
    const staffProfile = await this.prisma.staffProfile.findFirst({
      where: { 
        user: {
          id: userId
        }
      },
      select: { id: true },
    });
    return staffProfile?.id || null;
  }

  async getAllStatements(status?: string, search?: string) {
    const where: any = {};
    
    if (status && status !== 'all') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { statementNumber: { contains: search, mode: 'insensitive' } },
        { client: { 
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
          ]
        }},
      ];
    }

    return this.prisma.patientStatement.findMany({
      where,
      include: {
        client: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        createdByStaff: {
          select: {
            formalName: true,
            jobTitle: true,
          },
        },
        lineItems: {
          include: {
            claim: {
              select: {
                claimNumber: true,
              },
            },
            claimLineItem: {
              select: {
                cptCode: true,
                serviceDate: true,
                chargeAmount: true,
              },
            },
          },
        },
      },
      orderBy: {
        statementDate: 'desc',
      },
    });
  }

  async getStatementById(id: string) {
    const statement = await this.prisma.patientStatement.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        createdByStaff: {
          select: {
            formalName: true,
            jobTitle: true,
          },
        },
        lineItems: {
          include: {
            claim: {
              select: {
                claimNumber: true,
              },
            },
            claimLineItem: {
              select: {
                cptCode: true,
                serviceDate: true,
                chargeAmount: true,
              },
            },
          },
        },
      },
    });

    if (!statement) {
      throw new NotFoundException(`Statement with ID ${id} not found`);
    }

    return statement;
  }

  async createStatement(createStatementDto: CreateStatementDto, userId: string) {
    const staffProfileId = await this.getCurrentUserStaffProfile(userId);
    
    const { lineItems, ...statementData } = createStatementDto;

    return this.prisma.$transaction(async (prisma) => {
      const statement = await prisma.patientStatement.create({
        data: {
          ...statementData,
          statementDate: new Date(statementData.statementDate),
          dueDate: new Date(statementData.dueDate),
          createdBy: staffProfileId,
        },
        include: {
          client: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          createdByStaff: {
            select: {
              formalName: true,
              jobTitle: true,
            },
          },
          lineItems: {
            include: {
              claim: {
                select: {
                  claimNumber: true,
                },
              },
              claimLineItem: {
                select: {
                  cptCode: true,
                  serviceDate: true,
                  chargeAmount: true,
                },
              },
            },
          },
        },
      });

      // Create line items if provided
      if (lineItems && lineItems.length > 0) {
        await prisma.statementLineItem.createMany({
          data: lineItems.map(item => ({
            statementId: statement.id,
            claimId: item.claimId,
            claimLineItemId: item.claimLineItemId,
            serviceDate: new Date(item.serviceDate),
            description: item.description,
            cptCode: item.cptCode,
            chargeAmount: item.chargeAmount,
            insurancePayment: item.insurancePayment,
            adjustmentAmount: item.adjustmentAmount,
            patientResponsibility: item.patientResponsibility,
          })),
        });
      }

      return statement;
    });
  }

  async updateStatement(id: string, updateStatementDto: UpdateStatementDto) {
    const statement = await this.getStatementById(id);

    const data: any = { ...updateStatementDto };
    if (updateStatementDto.statementDate) {
      data.statementDate = new Date(updateStatementDto.statementDate);
    }
    if (updateStatementDto.dueDate) {
      data.dueDate = new Date(updateStatementDto.dueDate);
    }

    return this.prisma.patientStatement.update({
      where: { id },
      data,
      include: {
        client: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        createdByStaff: {
          select: {
            formalName: true,
            jobTitle: true,
          },
        },
        lineItems: {
          include: {
            claim: {
              select: {
                claimNumber: true,
              },
            },
            claimLineItem: {
              select: {
                cptCode: true,
                serviceDate: true,
                chargeAmount: true,
              },
            },
          },
        },
      },
    });
  }

  async deleteStatement(id: string) {
    const statement = await this.getStatementById(id);

    return this.prisma.$transaction(async (prisma) => {
      // Delete line items first
      await prisma.statementLineItem.deleteMany({
        where: { statementId: id },
      });

      // Delete the statement
      return prisma.patientStatement.delete({
        where: { id },
      });
    });
  }

  // Statement Line Item Methods
  async createStatementLineItem(statementId: string, lineItemData: any) {
    return this.prisma.statementLineItem.create({
      data: {
        ...lineItemData,
        statementId,
        serviceDate: new Date(lineItemData.serviceDate),
      },
      include: {
        statement: {
          select: {
            statementNumber: true,
            totalAmount: true,
          },
        },
        claim: {
          select: {
            claimNumber: true,
          },
        },
        claimLineItem: {
          select: {
            cptCode: true,
            serviceDate: true,
            chargeAmount: true,
          },
        },
      },
    });
  }

  async updateStatementLineItem(id: string, lineItemData: any) {
    const data: any = { ...lineItemData };
    if (lineItemData.serviceDate) {
      data.serviceDate = new Date(lineItemData.serviceDate);
    }

    return this.prisma.statementLineItem.update({
      where: { id },
      data,
      include: {
        statement: {
          select: {
            statementNumber: true,
            totalAmount: true,
          },
        },
        claim: {
          select: {
            claimNumber: true,
          },
        },
        claimLineItem: {
          select: {
            cptCode: true,
            serviceDate: true,
            chargeAmount: true,
          },
        },
      },
    });
  }

  async deleteStatementLineItem(id: string) {
    return this.prisma.statementLineItem.delete({
      where: { id },
    });
  }

  // Utility methods
  async generateStatementNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    
    const lastStatement = await this.prisma.patientStatement.findFirst({
      where: {
        statementNumber: {
          startsWith: `ST${year}${month}`,
        },
      },
      orderBy: {
        statementNumber: 'desc',
      },
    });

    let nextNumber = 1;
    if (lastStatement) {
      const lastNumber = parseInt(lastStatement.statementNumber.slice(-4));
      nextNumber = lastNumber + 1;
    }

    return `ST${year}${month}${String(nextNumber).padStart(4, '0')}`;
  }

  async markAsSent(id: string) {
    return this.prisma.patientStatement.update({
      where: { id },
      data: {
        status: 'sent',
        emailSentAt: new Date(),
      },
    });
  }

  async markAsOpened(id: string) {
    return this.prisma.patientStatement.update({
      where: { id },
      data: {
        emailOpenedAt: new Date(),
      },
    });
  }
}
