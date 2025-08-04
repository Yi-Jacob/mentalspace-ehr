import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SupervisionRelationshipsController } from './supervision-relationships.controller';
import { SupervisionRelationshipsService } from './supervision-relationships.service';
import { LicensesController } from './licenses.controller';
import { LicensesService } from './licenses.service';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [UsersController, SupervisionRelationshipsController, LicensesController],
  providers: [UsersService, SupervisionRelationshipsService, LicensesService],
  exports: [UsersService, SupervisionRelationshipsService, LicensesService],
})
export class UsersModule {} 