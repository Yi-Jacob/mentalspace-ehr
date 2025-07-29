import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DiagnosesService } from './diagnoses.service';
import { DiagnosisCodeEntity } from './entities/diagnosis-code.entity';

@ApiTags('diagnoses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('diagnoses')
export class DiagnosesController {
  constructor(private readonly diagnosesService: DiagnosesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active diagnosis codes' })
  @ApiResponse({ status: 200, description: 'Diagnosis codes retrieved successfully', type: [DiagnosisCodeEntity] })
  async findAll(@Query('search') search?: string): Promise<DiagnosisCodeEntity[]> {
    return this.diagnosesService.findAll(search);
  }
} 