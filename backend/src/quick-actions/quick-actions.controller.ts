import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QuickActionsService } from './quick-actions.service';
import { CreateQuickActionDto } from './dto';
import { QuickActionEntity } from './entities/quick-action.entity';

@ApiTags('quick-actions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('quick-actions')
export class QuickActionsController {
  constructor(private readonly quickActionsService: QuickActionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new quick action' })
  @ApiResponse({ status: 201, description: 'Quick action created successfully', type: QuickActionEntity })
  async create(@Body() createActionDto: CreateQuickActionDto, @Request() req): Promise<QuickActionEntity> {
    return this.quickActionsService.createAction(createActionDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all quick actions for the current user' })
  @ApiResponse({ status: 200, description: 'Quick actions retrieved successfully', type: [QuickActionEntity] })
  async findUserActions(@Request() req): Promise<QuickActionEntity[]> {
    return this.quickActionsService.findUserActions(req.user.id);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Mark a quick action as completed' })
  @ApiResponse({ status: 200, description: 'Quick action completed successfully', type: QuickActionEntity })
  async completeAction(@Param('id') id: string): Promise<QuickActionEntity> {
    return this.quickActionsService.completeAction(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a quick action' })
  @ApiResponse({ status: 200, description: 'Quick action deleted successfully' })
  async deleteAction(@Param('id') id: string): Promise<void> {
    return this.quickActionsService.deleteAction(id);
  }
} 