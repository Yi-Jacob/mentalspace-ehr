import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { ClientsRepository } from './repositories/clients.repository';
import { ClientsValidationService } from './services/clients-validation.service';
import { ClientsEventService } from './services/clients-event.service';
import { DatabaseModule } from '../database/database.module';
import { EmailService } from '../common/email.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [ClientsController],
  providers: [
    ClientsService,
    ClientsRepository,
    ClientsValidationService,
    ClientsEventService,
    EmailService,
  ],
  exports: [ClientsService],
})
export class ClientsModule {} 