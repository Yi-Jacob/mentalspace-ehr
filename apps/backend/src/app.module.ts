import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { UsersModule } from './staff/users.module';
import { NotesModule } from './notes/notes.module';
import { DiagnosesModule } from './diagnoses/diagnoses.module';
import { BillingModule } from './billing/billing.module';
import { ComplianceModule } from './compliance/compliance.module';
import { MessagesModule } from './messages/messages.module';
import { SchedulingModule } from './scheduling/scheduling.module';
import { ProductivityGoalsModule } from './productivity-goals/productivity-goals.module';
import { TrainingRecordsModule } from './training-records/training-records.module';
import { QuickActionsModule } from './quick-actions/quick-actions.module';
import { PermissionsModule } from './permissions/permissions.module';
import { AIChatbotModule } from './ai-chatbot/ai-chatbot.module';
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
    DiagnosesModule,
    BillingModule,
    ComplianceModule,
    MessagesModule,
    SchedulingModule,
    ProductivityGoalsModule,
    TrainingRecordsModule,
    QuickActionsModule,
    PermissionsModule,
    AIChatbotModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {} 