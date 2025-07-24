import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateDeadlineExceptionDto } from './dto/create-deadline-exception.dto';
import { UpdateDeadlineExceptionDto } from './dto/update-deadline-exception.dto';

@Injectable()
export class DeadlineExceptionService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllDeadlineExceptions(status?: string, providerId?: string) {
    const where: any = {};

    if (providerId) {
      where.providerId = providerId;
    }

    if (status) {
      where.status = status;
    }

    return this.prisma.deadlineExceptionRequest.findMany({
      where,
      include: {
        provider: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        reviewedByUser: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getDeadlineExceptionById(id: string) {
    const exception = await this.prisma.deadlineExceptionRequest.findUnique({
      where: { id },
      include: {
        provider: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        reviewedByUser: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!exception) {
      throw new NotFoundException(`Deadline exception with ID ${id} not found`);
    }

    return exception;
  }

  async createDeadlineException(createDeadlineExceptionDto: CreateDeadlineExceptionDto) {
    const data: any = {
      ...createDeadlineExceptionDto,
      requestedExtensionUntil: new Date(createDeadlineExceptionDto.requestedExtensionUntil),
    };

    if (createDeadlineExceptionDto.reviewedAt) {
      data.reviewedAt = new Date(createDeadlineExceptionDto.reviewedAt);
    }

    return this.prisma.deadlineExceptionRequest.create({
      data,
      include: {
        provider: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        reviewedByUser: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async updateDeadlineException(id: string, updateDeadlineExceptionDto: UpdateDeadlineExceptionDto) {
    const exception = await this.getDeadlineExceptionById(id);

    const data: any = { ...updateDeadlineExceptionDto };

    if (updateDeadlineExceptionDto.requestedExtensionUntil) {
      data.requestedExtensionUntil = new Date(updateDeadlineExceptionDto.requestedExtensionUntil);
    }
    if (updateDeadlineExceptionDto.reviewedAt) {
      data.reviewedAt = new Date(updateDeadlineExceptionDto.reviewedAt);
    }

    return this.prisma.deadlineExceptionRequest.update({
      where: { id },
      data,
      include: {
        provider: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        reviewedByUser: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async deleteDeadlineException(id: string) {
    const exception = await this.getDeadlineExceptionById(id);

    return this.prisma.deadlineExceptionRequest.delete({
      where: { id },
    });
  }

  async approveException(id: string, reviewedBy: string, reviewNotes?: string) {
    const exception = await this.getDeadlineExceptionById(id);

    if (exception.status && exception.status !== 'pending') {
      throw new BadRequestException('Exception has already been reviewed');
    }

    return this.prisma.deadlineExceptionRequest.update({
      where: { id },
      data: {
        status: 'approved',
        reviewedBy,
        reviewedAt: new Date(),
        reviewNotes,
      },
      include: {
        provider: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        reviewedByUser: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async rejectException(id: string, reviewedBy: string, reviewNotes?: string) {
    const exception = await this.getDeadlineExceptionById(id);

    if (exception.status && exception.status !== 'pending') {
      throw new BadRequestException('Exception has already been reviewed');
    }

    return this.prisma.deadlineExceptionRequest.update({
      where: { id },
      data: {
        status: 'rejected',
        reviewedBy,
        reviewedAt: new Date(),
        reviewNotes,
      },
      include: {
        provider: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        reviewedByUser: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }
} 