import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateSessionCompletionDto } from './dto/create-session-completion.dto';
import { UpdateSessionCompletionDto } from './dto/update-session-completion.dto';

@Injectable()
export class SessionCompletionService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllSessionCompletions(status?: string, providerId?: string, clientId?: string) {
    const where: any = {};

    if (providerId) {
      where.providerId = providerId;
    }

    if (clientId) {
      where.clientId = clientId;
    }

    if (status) {
      if (status === 'signed') {
        where.isNoteSigned = true;
      } else if (status === 'unsigned') {
        where.isNoteSigned = false;
        where.isLocked = false;
      } else if (status === 'locked') {
        where.isLocked = true;
      }
    }

    return this.prisma.sessionCompletion.findMany({
      where,
      include: {
        provider: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        client: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        sessionDate: 'desc',
      },
    });
  }

  async getSessionCompletionById(id: string) {
    const sessionCompletion = await this.prisma.sessionCompletion.findUnique({
      where: { id },
      include: {
        provider: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        client: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!sessionCompletion) {
      throw new NotFoundException(`Session completion with ID ${id} not found`);
    }

    return sessionCompletion;
  }

  async createSessionCompletion(createSessionCompletionDto: CreateSessionCompletionDto) {
    const data: any = {
      ...createSessionCompletionDto,
      sessionDate: new Date(createSessionCompletionDto.sessionDate),
    };

    if (createSessionCompletionDto.noteSignedAt) {
      data.noteSignedAt = new Date(createSessionCompletionDto.noteSignedAt);
    }
    if (createSessionCompletionDto.lockedAt) {
      data.lockedAt = new Date(createSessionCompletionDto.lockedAt);
    }
    if (createSessionCompletionDto.payPeriodWeek) {
      data.payPeriodWeek = new Date(createSessionCompletionDto.payPeriodWeek);
    }
    if (createSessionCompletionDto.supervisorOverrideAt) {
      data.supervisorOverrideAt = new Date(createSessionCompletionDto.supervisorOverrideAt);
    }

    return this.prisma.sessionCompletion.create({
      data,
      include: {
        provider: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        client: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async updateSessionCompletion(id: string, updateSessionCompletionDto: UpdateSessionCompletionDto) {
    const sessionCompletion = await this.getSessionCompletionById(id);

    const data: any = { ...updateSessionCompletionDto };

    if (updateSessionCompletionDto.sessionDate) {
      data.sessionDate = new Date(updateSessionCompletionDto.sessionDate);
    }
    if (updateSessionCompletionDto.noteSignedAt) {
      data.noteSignedAt = new Date(updateSessionCompletionDto.noteSignedAt);
    }
    if (updateSessionCompletionDto.lockedAt) {
      data.lockedAt = new Date(updateSessionCompletionDto.lockedAt);
    }
    if (updateSessionCompletionDto.payPeriodWeek) {
      data.payPeriodWeek = new Date(updateSessionCompletionDto.payPeriodWeek);
    }
    if (updateSessionCompletionDto.supervisorOverrideAt) {
      data.supervisorOverrideAt = new Date(updateSessionCompletionDto.supervisorOverrideAt);
    }

    return this.prisma.sessionCompletion.update({
      where: { id },
      data,
      include: {
        provider: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        client: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async deleteSessionCompletion(id: string) {
    const sessionCompletion = await this.getSessionCompletionById(id);

    return this.prisma.sessionCompletion.delete({
      where: { id },
    });
  }

  async signNote(id: string, signedBy: string) {
    const sessionCompletion = await this.getSessionCompletionById(id);

    if (sessionCompletion.isNoteSigned) {
      throw new BadRequestException('Note is already signed');
    }

    if (sessionCompletion.isLocked) {
      throw new BadRequestException('Session is locked and cannot be signed');
    }

    return this.prisma.sessionCompletion.update({
      where: { id },
      data: {
        isNoteSigned: true,
        noteSignedAt: new Date(),
      },
      include: {
        provider: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        client: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async lockSession(id: string, lockedBy: string, reason?: string) {
    const sessionCompletion = await this.getSessionCompletionById(id);

    if (sessionCompletion.isLocked) {
      throw new BadRequestException('Session is already locked');
    }

    return this.prisma.sessionCompletion.update({
      where: { id },
      data: {
        isLocked: true,
        lockedAt: new Date(),
      },
      include: {
        provider: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        client: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async supervisorOverride(id: string, overrideBy: string, reason: string) {
    const sessionCompletion = await this.getSessionCompletionById(id);

    return this.prisma.sessionCompletion.update({
      where: { id },
      data: {
        supervisorOverrideBy: overrideBy,
        supervisorOverrideReason: reason,
        supervisorOverrideAt: new Date(),
      },
      include: {
        provider: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        client: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }
} 