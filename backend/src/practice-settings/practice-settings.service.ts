import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { PracticeSettingsDto } from './dto/practice-settings.dto';
import { PracticeSettingsEntity } from './entities/practice-settings.entity';

@Injectable()
export class PracticeSettingsService {
  constructor(private prisma: PrismaService) {}

  async findUserSettings(userId: string): Promise<PracticeSettingsEntity | null> {
    const settings = await this.prisma.practiceSetting.findUnique({
      where: { userId },
    });

    return settings ? this.mapToEntity(settings) : null;
  }

  async upsertSettings(userId: string, settingsDto: PracticeSettingsDto): Promise<PracticeSettingsEntity> {
    const settings = await this.prisma.practiceSetting.upsert({
      where: { userId },
      update: {
        practiceName: settingsDto.practiceName,
        practiceAddress: settingsDto.practiceAddress,
        practiceContact: settingsDto.practiceContact,
        businessHours: settingsDto.businessHours,
        securitySettings: settingsDto.securitySettings,
        portalSettings: settingsDto.portalSettings,
        schedulingSettings: settingsDto.schedulingSettings,
        documentationSettings: settingsDto.documentationSettings,
        billingSettings: settingsDto.billingSettings,
      },
      create: {
        userId,
        practiceName: settingsDto.practiceName,
        practiceAddress: settingsDto.practiceAddress,
        practiceContact: settingsDto.practiceContact,
        businessHours: settingsDto.businessHours,
        securitySettings: settingsDto.securitySettings,
        portalSettings: settingsDto.portalSettings,
        schedulingSettings: settingsDto.schedulingSettings,
        documentationSettings: settingsDto.documentationSettings,
        billingSettings: settingsDto.billingSettings,
      },
    });

    return this.mapToEntity(settings);
  }

  async updateSettings(userId: string, settingsDto: PracticeSettingsDto): Promise<PracticeSettingsEntity> {
    const settings = await this.prisma.practiceSetting.update({
      where: { userId },
      data: {
        ...(settingsDto.practiceName !== undefined && { practiceName: settingsDto.practiceName }),
        ...(settingsDto.practiceAddress !== undefined && { practiceAddress: settingsDto.practiceAddress }),
        ...(settingsDto.practiceContact !== undefined && { practiceContact: settingsDto.practiceContact }),
        ...(settingsDto.businessHours !== undefined && { businessHours: settingsDto.businessHours }),
        ...(settingsDto.securitySettings !== undefined && { securitySettings: settingsDto.securitySettings }),
        ...(settingsDto.portalSettings !== undefined && { portalSettings: settingsDto.portalSettings }),
        ...(settingsDto.schedulingSettings !== undefined && { schedulingSettings: settingsDto.schedulingSettings }),
        ...(settingsDto.documentationSettings !== undefined && { documentationSettings: settingsDto.documentationSettings }),
        ...(settingsDto.billingSettings !== undefined && { billingSettings: settingsDto.billingSettings }),
      },
    });

    return this.mapToEntity(settings);
  }

  private mapToEntity(settings: any): PracticeSettingsEntity {
    return {
      id: settings.id,
      userId: settings.userId,
      practiceName: settings.practiceName,
      practiceAddress: settings.practiceAddress,
      practiceContact: settings.practiceContact,
      businessHours: settings.businessHours,
      securitySettings: settings.securitySettings,
      portalSettings: settings.portalSettings,
      schedulingSettings: settings.schedulingSettings,
      documentationSettings: settings.documentationSettings,
      billingSettings: settings.billingSettings,
      createdAt: settings.createdAt,
      updatedAt: settings.updatedAt,
    };
  }
} 