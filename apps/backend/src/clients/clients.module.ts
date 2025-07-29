import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { ClientsRepository } from './repositories/clients.repository';
import { ClientsValidationService } from './services/clients-validation.service';
import { ClientsEventService } from './services/clients-event.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ClientsController],
  providers: [
    ClientsService,
    ClientsRepository,
    ClientsValidationService,
    ClientsEventService,
  ],
  exports: [ClientsService],
})
export class ClientsModule {} 