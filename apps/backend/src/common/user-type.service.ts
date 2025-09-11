import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UserTypeService {
  constructor(private prisma: PrismaService) {}

  // Helper method to get client by user ID
  async getClientByUserId(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { clientId: true },
    });

    if (!user?.clientId) {
      return null;
    }

    return this.prisma.client.findUnique({
      where: { id: user.clientId },
      select: { id: true },
    });
  }

  // Helper method to get staff profile by user ID
  async getStaffProfileByUserId(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { staffId: true },
    });

    if (!user?.staffId) {
      return null;
    }

    return this.prisma.staffProfile.findUnique({
      where: { id: user.staffId },
      select: { id: true },
    });
  }

  // Helper method to get supervisee IDs for a supervisor
  async getSuperviseeIds(supervisorId: string): Promise<string[]> {
    const supervisionRelationships = await this.prisma.supervisionRelationship.findMany({
      where: {
        supervisorId,
        status: 'active',
      },
      select: { superviseeId: true },
    });

    return supervisionRelationships.map(rel => rel.superviseeId);
  }
}
