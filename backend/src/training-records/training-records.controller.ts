import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TrainingRecordsService } from './training-records.service';
import { CreateTrainingRecordDto, UpdateTrainingRecordDto } from './dto';
import { TrainingRecordEntity } from './entities/training-record.entity';

@ApiTags('training-records')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('training-records')
export class TrainingRecordsController {
  constructor(private readonly trainingRecordsService: TrainingRecordsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new training record' })
  @ApiResponse({ status: 201, description: 'Training record created successfully', type: TrainingRecordEntity })
  async create(@Body() createRecordDto: CreateTrainingRecordDto, @Request() req): Promise<TrainingRecordEntity> {
    return this.trainingRecordsService.createRecord(createRecordDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all training records' })
  @ApiResponse({ status: 200, description: 'Training records retrieved successfully', type: [TrainingRecordEntity] })
  async findAll(): Promise<TrainingRecordEntity[]> {
    return this.trainingRecordsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a training record by ID' })
  @ApiResponse({ status: 200, description: 'Training record retrieved successfully', type: TrainingRecordEntity })
  async findOne(@Param('id') id: string): Promise<TrainingRecordEntity> {
    return this.trainingRecordsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a training record' })
  @ApiResponse({ status: 200, description: 'Training record updated successfully', type: TrainingRecordEntity })
  async update(@Param('id') id: string, @Body() updateRecordDto: UpdateTrainingRecordDto): Promise<TrainingRecordEntity> {
    return this.trainingRecordsService.updateRecord(id, updateRecordDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a training record' })
  @ApiResponse({ status: 200, description: 'Training record deleted successfully' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.trainingRecordsService.deleteRecord(id);
  }
} 