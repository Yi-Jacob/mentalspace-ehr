import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UpdatePracticeSettingsDto } from './dto/update-practice-settings.dto';
import { PracticeSettingsResponseDto } from './dto/practice-settings-response.dto';

@Injectable()
export class PracticeSettingsService {
  constructor(private prisma: PrismaService) {}

  async getPracticeSettings(): Promise<PracticeSettingsResponseDto> {
    // Get the first (and should be only) practice settings record
    const settings = await this.prisma.practiceSetting.findFirst();

    if (!settings) {
      // Create default settings if they don't exist
      return this.createDefaultSettings();
    }

    return {
      id: settings.id,
      practiceInfo: settings.practiceInfo as Record<string, any> || {},
      authSettings: settings.authSettings as Record<string, any> || {},
      complianceSettings: settings.complianceSettings as Record<string, any> || {},
      aiSettings: settings.aiSettings as Record<string, any> || {},
      documentationSettings: settings.documentationSettings as Record<string, any> || {},
      schedulingSettings: settings.schedulingSettings as Record<string, any> || {},
      noteSettings: settings.noteSettings as Record<string, any> || {},
      staffSettings: settings.staffSettings as Record<string, any> || {},
      clientSettings: settings.clientSettings as Record<string, any> || {},
      createdAt: settings.createdAt,
      updatedAt: settings.updatedAt,
    };
  }

  async updatePracticeSettings(
    updateDto: UpdatePracticeSettingsDto,
  ): Promise<PracticeSettingsResponseDto> {
    const existingSettings = await this.prisma.practiceSetting.findFirst();

    if (!existingSettings) {
      // Create settings if they don't exist
      const newSettings = await this.prisma.practiceSetting.create({
        data: updateDto,
      });

      return {
        id: newSettings.id,
        practiceInfo: newSettings.practiceInfo as Record<string, any> || {},
        authSettings: newSettings.authSettings as Record<string, any> || {},
        complianceSettings: newSettings.complianceSettings as Record<string, any> || {},
        aiSettings: newSettings.aiSettings as Record<string, any> || {},
        documentationSettings: newSettings.documentationSettings as Record<string, any> || {},
        schedulingSettings: newSettings.schedulingSettings as Record<string, any> || {},
        noteSettings: newSettings.noteSettings as Record<string, any> || {},
        staffSettings: newSettings.staffSettings as Record<string, any> || {},
        clientSettings: newSettings.clientSettings as Record<string, any> || {},
        createdAt: newSettings.createdAt,
        updatedAt: newSettings.updatedAt,
      };
    }

    const updatedSettings = await this.prisma.practiceSetting.update({
      where: { id: existingSettings.id },
      data: updateDto,
    });

    return {
      id: updatedSettings.id,
      practiceInfo: updatedSettings.practiceInfo as Record<string, any> || {},
      authSettings: updatedSettings.authSettings as Record<string, any> || {},
      complianceSettings: updatedSettings.complianceSettings as Record<string, any> || {},
      aiSettings: updatedSettings.aiSettings as Record<string, any> || {},
      documentationSettings: updatedSettings.documentationSettings as Record<string, any> || {},
      schedulingSettings: updatedSettings.schedulingSettings as Record<string, any> || {},
      noteSettings: updatedSettings.noteSettings as Record<string, any> || {},
      staffSettings: updatedSettings.staffSettings as Record<string, any> || {},
      clientSettings: updatedSettings.clientSettings as Record<string, any> || {},
      createdAt: updatedSettings.createdAt,
      updatedAt: updatedSettings.updatedAt,
    };
  }

  private async createDefaultSettings(): Promise<PracticeSettingsResponseDto> {
    const defaultSettings = await this.prisma.practiceSetting.create({
      data: {
        practiceInfo: {
          timezone: 'America/New_York',
          companyEmail: '',
        },
        authSettings: {
          jwtExpiresIn: '24h',
          defaultPassword: '',
          passwordResetExpirationMinutes: 60,
        },
        aiSettings: {
          openaiApiKey: '',
        },
        complianceSettings: {},
        documentationSettings: {},
        schedulingSettings: {},
        noteSettings: {},
        staffSettings: {},
        clientSettings: {},
      },
    });

    return {
      id: defaultSettings.id,
      practiceInfo: defaultSettings.practiceInfo as Record<string, any> || {},
      authSettings: defaultSettings.authSettings as Record<string, any> || {},
      complianceSettings: defaultSettings.complianceSettings as Record<string, any> || {},
      aiSettings: defaultSettings.aiSettings as Record<string, any> || {},
      documentationSettings: defaultSettings.documentationSettings as Record<string, any> || {},
      schedulingSettings: defaultSettings.schedulingSettings as Record<string, any> || {},
      noteSettings: defaultSettings.noteSettings as Record<string, any> || {},
      staffSettings: defaultSettings.staffSettings as Record<string, any> || {},
      clientSettings: defaultSettings.clientSettings as Record<string, any> || {},
      createdAt: defaultSettings.createdAt,
      updatedAt: defaultSettings.updatedAt,
    };
  }
}
