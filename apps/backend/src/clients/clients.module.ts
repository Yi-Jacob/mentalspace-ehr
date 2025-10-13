import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { ClientsRepository } from './repositories/clients.repository';
import { ClientsValidationService } from './services/clients-validation.service';
import { ClientsEventService } from './services/clients-event.service';
import { ClientFilesController } from './client-files.controller';
import { ClientFilesService } from './client-files.service';
import { UploadController } from './upload.controller';
import { DatabaseModule } from '../database/database.module';
import { EmailService } from '../common/email.service';
import { S3Service } from '../common/s3.service';
import { AuthModule } from '../auth/auth.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [DatabaseModule, AuthModule, AuditModule],
  controllers: [ClientsController, ClientFilesController, UploadController],
  providers: [
    ClientsService,
    ClientsRepository,
    ClientsValidationService,
    ClientsEventService,
    ClientFilesService,
    EmailService,
    S3Service,
  ],
  exports: [ClientsService, ClientFilesService, S3Service],
})
export class ClientsModule {} 