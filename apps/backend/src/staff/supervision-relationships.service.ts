import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateSupervisionRelationshipDto } from './dto/create-supervision-relationship.dto';
import { UpdateSupervisionRelationshipDto } from './dto/update-supervision-relationship.dto';

@Injectable()
export class SupervisionRelationshipsService {
  constructor(private prisma: PrismaService) {}

  async create(createSupervisionRelationshipDto: CreateSupervisionRelationshipDto) {
    // Validate that supervisor and supervisee exist
    const supervisor = await this.prisma.user.findUnique({
      where: { id: createSupervisionRelationshipDto.supervisorId },
      include: { userRoles: true }
    });

    const supervisee = await this.prisma.user.findUnique({
      where: { id: createSupervisionRelationshipDto.superviseeId },
      include: { userRoles: true }
    });

    if (!supervisor) {
      throw new NotFoundException('Supervisor not found');
    }

    if (!supervisee) {
      throw new NotFoundException('Supervisee not found');
    }

    // Check if supervisor has appropriate role
    const supervisorRoles = supervisor.userRoles.map(ur => ur.role);
    const validSupervisorRoles = ['Supervisor', 'Clinical Administrator', 'Practice Administrator'];
    const hasValidSupervisorRole = supervisorRoles.some(role => validSupervisorRoles.includes(role));

    if (!hasValidSupervisorRole) {
      throw new BadRequestException('Supervisor must have Supervisor, Clinical Administrator, or Practice Administrator role');
    }

    // Check if supervisee has appropriate role
    const superviseeRoles = supervisee.userRoles.map(ur => ur.role);
    const validSuperviseeRoles = ['Intern', 'Clinician'];
    const hasValidSuperviseeRole = superviseeRoles.some(role => validSuperviseeRoles.includes(role));

    if (!hasValidSuperviseeRole) {
      throw new BadRequestException('Supervisee must have Intern or Clinician role');
    }

    return this.prisma.supervisionRelationship.create({
      data: {
        supervisorId: createSupervisionRelationshipDto.supervisorId,
        superviseeId: createSupervisionRelationshipDto.superviseeId,
        startDate: new Date(createSupervisionRelationshipDto.startDate),
        endDate: createSupervisionRelationshipDto.endDate ? new Date(createSupervisionRelationshipDto.endDate) : null,
        notes: createSupervisionRelationshipDto.notes,
        status: createSupervisionRelationshipDto.status || 'active'
      },
      include: {
        supervisor: {
          include: {
            userRoles: true
          }
        },
        supervisee: {
          include: {
            userRoles: true
          }
        }
      }
    });
  }

  async findAll() {
    return this.prisma.supervisionRelationship.findMany({
      include: {
        supervisor: {
          include: {
            userRoles: true
          }
        },
        supervisee: {
          include: {
            userRoles: true
          }
        }
      },
      orderBy: [
        { status: 'asc' }, // Active first
        { updatedAt: 'desc' }
      ]
    });
  }

  async findOne(id: string) {
    const supervision = await this.prisma.supervisionRelationship.findUnique({
      where: { id },
      include: {
        supervisor: {
          include: {
            userRoles: true
          }
        },
        supervisee: {
          include: {
            userRoles: true
          }
        }
      }
    });

    if (!supervision) {
      throw new NotFoundException('Supervision relationship not found');
    }

    return supervision;
  }

  async update(id: string, updateSupervisionRelationshipDto: UpdateSupervisionRelationshipDto) {
    const supervision = await this.findOne(id);

    const updateData: any = {};

    if (updateSupervisionRelationshipDto.status) {
      updateData.status = updateSupervisionRelationshipDto.status;
      
      // If status is being set to completed, set endDate to current date if not provided
      if (updateSupervisionRelationshipDto.status === 'completed' && !updateSupervisionRelationshipDto.endDate) {
        updateData.endDate = new Date();
      }
    }

    if (updateSupervisionRelationshipDto.endDate) {
      updateData.endDate = new Date(updateSupervisionRelationshipDto.endDate);
    }

    if (updateSupervisionRelationshipDto.notes !== undefined) {
      updateData.notes = updateSupervisionRelationshipDto.notes;
    }

    if (updateSupervisionRelationshipDto.terminationNotes !== undefined) {
      updateData.terminationNotes = updateSupervisionRelationshipDto.terminationNotes;
    }

    updateData.updatedAt = new Date();

    return this.prisma.supervisionRelationship.update({
      where: { id },
      data: updateData,
      include: {
        supervisor: {
          include: {
            userRoles: true
          }
        },
        supervisee: {
          include: {
            userRoles: true
          }
        }
      }
    });
  }

  async getSupervisorCandidates() {
    return this.prisma.user.findMany({
      where: {
        userRoles: {
          some: {
            role: {
              in: ['Supervisor', 'Clinical Administrator', 'Practice Administrator']
            },
            isActive: true
          }
        },
        isActive: true
      },
      include: {
        userRoles: true
      },
      orderBy: {
        firstName: 'asc'
      }
    });
  }

  async getSuperviseeCandidates() {
    return this.prisma.user.findMany({
      where: {
        userRoles: {
          some: {
            role: {
              in: ['Intern', 'Clinician']
            },
            isActive: true
          }
        },
        isActive: true
      },
      include: {
        userRoles: true
      },
      orderBy: {
        firstName: 'asc'
      }
    });
  }
} 