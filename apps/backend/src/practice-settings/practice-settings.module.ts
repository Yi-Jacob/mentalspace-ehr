import { Module } from '@nestjs/common';
import { PracticeSettingsController } from './practice-settings.controller';
import { PracticeSettingsService } from './practice-settings.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PracticeSettingsController],
  providers: [PracticeSettingsService],
  exports: [PracticeSettingsService],
})
export class PracticeSettingsModule {}
