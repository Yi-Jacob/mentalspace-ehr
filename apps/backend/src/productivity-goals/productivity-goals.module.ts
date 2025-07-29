import { Module } from '@nestjs/common';
import { ProductivityGoalsController } from './productivity-goals.controller';
import { ProductivityGoalsService } from './productivity-goals.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductivityGoalsController],
  providers: [ProductivityGoalsService],
  exports: [ProductivityGoalsService],
})
export class ProductivityGoalsModule {} 