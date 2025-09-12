import { Module } from '@nestjs/common';
import { StaffsController } from './staffs.controller';
import { StaffsService } from './staffs.service';
import { SupervisionRelationshipsController } from './supervision-relationships.controller';
import { SupervisionRelationshipsService } from './supervision-relationships.service';
import { LicensesController } from './licenses.controller';
import { LicensesService } from './licenses.service';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [StaffsController, SupervisionRelationshipsController, LicensesController],
  providers: [StaffsService, SupervisionRelationshipsService, LicensesService],
  exports: [StaffsService, SupervisionRelationshipsService, LicensesService],
})
export class StaffsModule {} 