import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PracticeSettingsService } from './practice-settings.service';
import { UpdatePracticeSettingsDto } from './dto/update-practice-settings.dto';
import { PracticeSettingsResponseDto } from './dto/practice-settings-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('practice-settings')
@UseGuards(JwtAuthGuard)
export class PracticeSettingsController {
  constructor(private readonly practiceSettingsService: PracticeSettingsService) {}

  @Get()
  async getPracticeSettings(): Promise<PracticeSettingsResponseDto> {
    return this.practiceSettingsService.getPracticeSettings();
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  async updatePracticeSettings(
    @Body() updateDto: UpdatePracticeSettingsDto,
  ): Promise<PracticeSettingsResponseDto> {
    return this.practiceSettingsService.updatePracticeSettings(updateDto);
  }
}
