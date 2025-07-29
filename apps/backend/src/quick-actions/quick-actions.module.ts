import { Module } from '@nestjs/common';
import { QuickActionsController } from './quick-actions.controller';
import { QuickActionsService } from './quick-actions.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [QuickActionsController],
  providers: [QuickActionsService],
  exports: [QuickActionsService],
})
export class QuickActionsModule {} 