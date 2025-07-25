import { Module } from '@nestjs/common';
import { TrainingRecordsController } from './training-records.controller';
import { TrainingRecordsService } from './training-records.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TrainingRecordsController],
  providers: [TrainingRecordsService],
  exports: [TrainingRecordsService],
})
export class TrainingRecordsModule {} 