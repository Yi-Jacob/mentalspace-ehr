import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateVerificationDto } from './dto/create-verification.dto';
import { UpdateVerificationDto } from './dto/update-verification.dto';
import { Request } from 'express';

@Injectable()
export class VerificationService {
  constructor(private readonly prisma: PrismaService) {}

  private async getCurrentUserStaffProfile(userId: string): Promise<string | null> {
    const staffProfile = await this.prisma.staffProfile.findFirst({
      where: {
        user: {
          id: userId,
        },
      },
      select: {
        id: true,
      },
    });
    return staffProfile?.id || null;
  }

  async getAllVerifications(status?: string, providerId?: string) {
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (providerId) {
      where.clientId = providerId;
    }

    return this.prisma.insuranceVerification.findMany({
      where,
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
            payer: {
              select: {
                name: true,
              },
            },
          },
        },
        verifiedByStaff: {
          select: {
            id: true,
            formalName: true,
            jobTitle: true,
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        verificationDate: 'desc',
      },
    });
  }

  async getVerificationById(id: string) {
    const verification = await this.prisma.insuranceVerification.findUnique({
      where: { id },
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
            payer: {
              select: {
                name: true,
              },
            },
          },
        },
        verifiedByStaff: {
          select: {
            id: true,
            formalName: true,
            jobTitle: true,
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!verification) {
      throw new NotFoundException(`Verification with ID ${id} not found`);
    }

    return verification;
  }

  async createVerification(createVerificationDto: CreateVerificationDto, userId: string) {
    const staffProfileId = await this.getCurrentUserStaffProfile(userId);
    
    return this.prisma.insuranceVerification.create({
      data: {
        ...createVerificationDto,
        verificationDate: new Date(createVerificationDto.verificationDate),
        authorizationExpiry: createVerificationDto.authorizationExpiry ? new Date(createVerificationDto.authorizationExpiry) : null,
        nextVerificationDate: createVerificationDto.nextVerificationDate ? new Date(createVerificationDto.nextVerificationDate) : null,
        verifiedBy: staffProfileId,
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
            payer: {
              select: {
                name: true,
              },
            },
          },
        },
        verifiedByStaff: {
          select: {
            id: true,
            formalName: true,
            jobTitle: true,
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async updateVerification(id: string, updateVerificationDto: UpdateVerificationDto) {
    const verification = await this.getVerificationById(id);

    const data: any = { ...updateVerificationDto };
    if (updateVerificationDto.verificationDate) {
      data.verificationDate = new Date(updateVerificationDto.verificationDate);
    }
    if (updateVerificationDto.authorizationExpiry) {
      data.authorizationExpiry = new Date(updateVerificationDto.authorizationExpiry);
    }
    if (updateVerificationDto.nextVerificationDate) {
      data.nextVerificationDate = new Date(updateVerificationDto.nextVerificationDate);
    }

    return this.prisma.insuranceVerification.update({
      where: { id },
      data,
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
            payer: {
              select: {
                name: true,
              },
            },
          },
        },
        verifiedByStaff: {
          select: {
            id: true,
            formalName: true,
            jobTitle: true,
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async deleteVerification(id: string) {
    const verification = await this.getVerificationById(id);

    return this.prisma.insuranceVerification.delete({
      where: { id },
    });
  }
} 