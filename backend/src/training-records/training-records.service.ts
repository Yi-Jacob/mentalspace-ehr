import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateTrainingRecordDto, UpdateTrainingRecordDto } from './dto';
import { TrainingRecordEntity } from './entities/training-record.entity';

@Injectable()
export class TrainingRecordsService {
  constructor(private prisma: PrismaService) {}

  async createRecord(createRecordDto: CreateTrainingRecordDto, userId: string): Promise<TrainingRecordEntity> {
    const record = await this.prisma.trainingRecord.create({
      data: {
        userId,
        trainingTitle: createRecordDto.trainingTitle,
        trainingType: createRecordDto.trainingType,
        providerOrganization: createRecordDto.providerOrganization,
        completionDate: createRecordDto.completionDate ? new Date(createRecordDto.completionDate) : null,
        expiryDate: createRecordDto.expiryDate ? new Date(createRecordDto.expiryDate) : null,
        hoursCompleted: createRecordDto.hoursCompleted,
        certificateNumber: createRecordDto.certificateNumber,
        status: createRecordDto.status,
        notes: createRecordDto.notes,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return this.mapToEntity(record);
  }

  async findAll(): Promise<TrainingRecordEntity[]> {
    const records = await this.prisma.trainingRecord.findMany({
      orderBy: { completionDate: 'desc' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return records.map(record => this.mapToEntity(record));
  }

  async findOne(id: string): Promise<TrainingRecordEntity> {
    const record = await this.prisma.trainingRecord.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!record) {
      throw new NotFoundException(`Training record with ID ${id} not found`);
    }

    return this.mapToEntity(record);
  }

  async updateRecord(id: string, updateRecordDto: UpdateTrainingRecordDto): Promise<TrainingRecordEntity> {
    const record = await this.prisma.trainingRecord.update({
      where: { id },
      data: {
        ...(updateRecordDto.trainingTitle && { trainingTitle: updateRecordDto.trainingTitle }),
        ...(updateRecordDto.trainingType && { trainingType: updateRecordDto.trainingType }),
        ...(updateRecordDto.providerOrganization !== undefined && { providerOrganization: updateRecordDto.providerOrganization }),
        ...(updateRecordDto.completionDate && { completionDate: new Date(updateRecordDto.completionDate) }),
        ...(updateRecordDto.expiryDate && { expiryDate: new Date(updateRecordDto.expiryDate) }),
        ...(updateRecordDto.hoursCompleted !== undefined && { hoursCompleted: updateRecordDto.hoursCompleted }),
        ...(updateRecordDto.certificateNumber !== undefined && { certificateNumber: updateRecordDto.certificateNumber }),
        ...(updateRecordDto.status && { status: updateRecordDto.status }),
        ...(updateRecordDto.notes !== undefined && { notes: updateRecordDto.notes }),
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return this.mapToEntity(record);
  }

  async deleteRecord(id: string): Promise<void> {
    await this.prisma.trainingRecord.delete({
      where: { id },
    });
  }

  private mapToEntity(record: any): TrainingRecordEntity {
    return {
      id: record.id,
      userId: record.userId,
      trainingTitle: record.trainingTitle,
      trainingType: record.trainingType,
      providerOrganization: record.providerOrganization,
      completionDate: record.completionDate,
      expiryDate: record.expiryDate,
      hoursCompleted: record.hoursCompleted,
      certificateNumber: record.certificateNumber,
      status: record.status,
      notes: record.notes,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      user: record.user ? {
        firstName: record.user.firstName,
        lastName: record.user.lastName,
      } : undefined,
    };
  }
} 