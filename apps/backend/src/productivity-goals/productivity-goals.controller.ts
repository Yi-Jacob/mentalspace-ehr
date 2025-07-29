import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProductivityGoalsService } from './productivity-goals.service';
import { CreateProductivityGoalDto, UpdateProductivityGoalDto } from './dto';
import { ProductivityGoalEntity } from './entities/productivity-goal.entity';

@ApiTags('productivity-goals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('productivity-goals')
export class ProductivityGoalsController {
  constructor(private readonly productivityGoalsService: ProductivityGoalsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new productivity goal' })
  @ApiResponse({ status: 201, description: 'Productivity goal created successfully', type: ProductivityGoalEntity })
  async create(@Body() createGoalDto: CreateProductivityGoalDto, @Request() req): Promise<ProductivityGoalEntity> {
    return this.productivityGoalsService.createGoal(createGoalDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all productivity goals for the current user' })
  @ApiResponse({ status: 200, description: 'Productivity goals retrieved successfully', type: [ProductivityGoalEntity] })
  async findAll(@Request() req, @Query('date') date?: string): Promise<ProductivityGoalEntity[]> {
    return this.productivityGoalsService.findAll(req.user.id, date);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a productivity goal by ID' })
  @ApiResponse({ status: 200, description: 'Productivity goal retrieved successfully', type: ProductivityGoalEntity })
  async findOne(@Param('id') id: string): Promise<ProductivityGoalEntity> {
    return this.productivityGoalsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a productivity goal' })
  @ApiResponse({ status: 200, description: 'Productivity goal updated successfully', type: ProductivityGoalEntity })
  async update(@Param('id') id: string, @Body() updateGoalDto: UpdateProductivityGoalDto): Promise<ProductivityGoalEntity> {
    return this.productivityGoalsService.updateGoal(id, updateGoalDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a productivity goal' })
  @ApiResponse({ status: 200, description: 'Productivity goal deleted successfully' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.productivityGoalsService.deleteGoal(id);
  }
} 