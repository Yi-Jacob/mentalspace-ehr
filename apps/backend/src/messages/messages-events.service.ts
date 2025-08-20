import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class MessagesEventsService {
  constructor(private eventEmitter: EventEmitter2) {}

  // Emit events that the gateway can listen to
  emitNewMessage(conversationId: string, message: any) {
    this.eventEmitter.emit('message.new', { conversationId, message });
  }

  emitConversationUpdate(conversationId: string, update: any) {
    this.eventEmitter.emit('conversation.updated', { conversationId, update });
  }

  emitParticipantChange(conversationId: string, change: any) {
    this.eventEmitter.emit('participant.changed', { conversationId, change });
  }
}
