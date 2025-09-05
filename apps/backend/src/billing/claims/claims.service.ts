import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateClaimDto } from './dto/create-claim.dto';
import { UpdateClaimDto } from './dto/update-claim.dto';

@Injectable()
export class ClaimsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllClaims(status?: string, search?: string) {
    const where: any = {};
    
    if (status && status !== 'all') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { claimNumber: { contains: search, mode: 'insensitive' } },
        { client: { 
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
          ]
        }},
      ];
    }

    return this.prisma.claim.findMany({
      where,
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
        provider: {
          select: {
            id: true,
            email: true,
            staffProfile: {
              select: {
                formalName: true,
                jobTitle: true,
              },
            },
          },
        },
        lineItems: {
          select: {
            id: true,
            serviceDate: true,
            cptCode: true,
            modifier1: true,
            modifier2: true,
            modifier3: true,
            modifier4: true,
            diagnosisPointer: true,
            units: true,
            chargeAmount: true,
            allowedAmount: true,
            paidAmount: true,
            adjustmentAmount: true,
            patientResponsibility: true,
            lineNote: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getClaimById(id: string) {
    const claim = await this.prisma.claim.findUnique({
      where: { id },
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
        provider: {
          select: {
            id: true,
            email: true,
            staffProfile: {
              select: {
                formalName: true,
                jobTitle: true,
              },
            },
          },
        },
        lineItems: {
          select: {
            id: true,
            serviceDate: true,
            cptCode: true,
            modifier1: true,
            modifier2: true,
            modifier3: true,
            modifier4: true,
            diagnosisPointer: true,
            units: true,
            chargeAmount: true,
            allowedAmount: true,
            paidAmount: true,
            adjustmentAmount: true,
            patientResponsibility: true,
            lineNote: true,
          },
        },
      },
    });

    if (!claim) {
      throw new NotFoundException(`Claim with ID ${id} not found`);
    }

    return claim;
  }

  async createClaim(createClaimDto: CreateClaimDto) {
    return this.prisma.claim.create({
      data: {
        ...createClaimDto,
        serviceDate: new Date(createClaimDto.serviceDate),
        submissionDate: createClaimDto.submissionDate ? new Date(createClaimDto.submissionDate) : null,
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
        provider: {
          select: {
            id: true,
            email: true,
            staffProfile: {
              select: {
                formalName: true,
                jobTitle: true,
              },
            },
          },
        },
        lineItems: {
          select: {
            id: true,
            serviceDate: true,
            cptCode: true,
            modifier1: true,
            modifier2: true,
            modifier3: true,
            modifier4: true,
            diagnosisPointer: true,
            units: true,
            chargeAmount: true,
            allowedAmount: true,
            paidAmount: true,
            adjustmentAmount: true,
            patientResponsibility: true,
            lineNote: true,
          },
        },
      },
    });
  }

  async updateClaim(id: string, updateClaimDto: UpdateClaimDto) {
    const claim = await this.getClaimById(id);

    const data: any = { ...updateClaimDto };
    if (updateClaimDto.serviceDate) {
      data.serviceDate = new Date(updateClaimDto.serviceDate);
    }
    if (updateClaimDto.submissionDate) {
      data.submissionDate = new Date(updateClaimDto.submissionDate);
    }

    return this.prisma.claim.update({
      where: { id },
      data,
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
        provider: {
          select: {
            id: true,
            email: true,
            staffProfile: {
              select: {
                formalName: true,
                jobTitle: true,
              },
            },
          },
        },
        lineItems: {
          select: {
            id: true,
            serviceDate: true,
            cptCode: true,
            modifier1: true,
            modifier2: true,
            modifier3: true,
            modifier4: true,
            diagnosisPointer: true,
            units: true,
            chargeAmount: true,
            allowedAmount: true,
            paidAmount: true,
            adjustmentAmount: true,
            patientResponsibility: true,
            lineNote: true,
          },
        },
      },
    });
  }

  async deleteClaim(id: string) {
    const claim = await this.getClaimById(id);

    return this.prisma.claim.delete({
      where: { id },
    });
  }
} 