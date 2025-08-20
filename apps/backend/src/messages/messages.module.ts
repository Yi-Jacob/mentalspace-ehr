import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { MessagesEventsService } from './messages-events.service';
import { DatabaseModule } from '../database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
    EventEmitterModule.forRoot(),
  ],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesGateway, MessagesEventsService],
  exports: [MessagesService, MessagesGateway],
})
export class MessagesModule {} 