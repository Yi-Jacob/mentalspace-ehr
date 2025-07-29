import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PracticeSettingsService } from './practice-settings.service';
import { PracticeSettingsDto } from './dto/practice-settings.dto';
import { PracticeSettingsEntity } from './entities/practice-settings.entity';

@ApiTags('practice-settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('practice-settings')
export class PracticeSettingsController {
  constructor(private readonly practiceSettingsService: PracticeSettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user practice settings' })
  @ApiResponse({ status: 200, description: 'Practice settings retrieved successfully', type: PracticeSettingsEntity })
  async findUserSettings(@Request() req): Promise<PracticeSettingsEntity | null> {
    return this.practiceSettingsService.findUserSettings(req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create or update practice settings' })
  @ApiResponse({ status: 201, description: 'Practice settings created/updated successfully', type: PracticeSettingsEntity })
  async upsertSettings(@Body() settingsDto: PracticeSettingsDto, @Request() req): Promise<PracticeSettingsEntity> {
    return this.practiceSettingsService.upsertSettings(req.user.id, settingsDto);
  }

  @Patch()
  @ApiOperation({ summary: 'Update practice settings' })
  @ApiResponse({ status: 200, description: 'Practice settings updated successfully', type: PracticeSettingsEntity })
  async updateSettings(@Body() settingsDto: PracticeSettingsDto, @Request() req): Promise<PracticeSettingsEntity> {
    return this.practiceSettingsService.updateSettings(req.user.id, settingsDto);
  }
} 