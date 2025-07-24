import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { UsersModule } from './staff/users.module';
import { NotesModule } from './notes/notes.module';
import { BillingModule } from './billing/billing.module';
import { ComplianceModule } from './compliance/compliance.module';
import { MessagesModule } from './messages/messages.module';
import { DatabaseModule } from './database/database.module';
import { ValidationModule } from './common/validation/validation.module';
import { LoggerModule } from './common/logger/logger.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    DatabaseModule,
    ValidationModule,
    LoggerModule,
    AuthModule,
    UsersModule,
    ClientsModule,
    NotesModule,
    BillingModule,
    ComplianceModule,
    MessagesModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {} 