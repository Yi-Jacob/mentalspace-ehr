import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { DiagnosisCodeEntity } from './entities/diagnosis-code.entity';

@Injectable()
export class DiagnosesService {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string): Promise<DiagnosisCodeEntity[]> {
    const where: any = {
      isActive: true,
    };

    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const diagnosisCodes = await this.prisma.diagnosisCode.findMany({
      where,
      orderBy: { code: 'asc' },
    });

    return diagnosisCodes.map(code => this.mapToEntity(code));
  }

  private mapToEntity(diagnosisCode: any): DiagnosisCodeEntity {
    return {
      id: diagnosisCode.id,
      code: diagnosisCode.code,
      description: diagnosisCode.description,
      category: diagnosisCode.category,
      isActive: diagnosisCode.isActive,
      createdAt: diagnosisCode.createdAt,
    };
  }
} 