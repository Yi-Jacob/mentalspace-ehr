import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateConversationDto, CreateMessageDto } from './dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  // Get all conversations for a therapist
  async getConversations(therapistId: string) {
    return this.prisma.conversation.findMany({
      where: {
        therapistId,
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        lastMessageAt: 'desc',
      },
    });
  }

  // Get conversation by ID
  async getConversation(id: string, therapistId: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id,
        therapistId,
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }

  // Create a new conversation
  async createConversation(createConversationDto: CreateConversationDto, therapistId: string) {
    // Check if conversation already exists
    const existingConversation = await this.prisma.conversation.findFirst({
      where: {
        clientId: createConversationDto.clientId,
        therapistId,
      },
    });

    if (existingConversation) {
      throw new ConflictException('A conversation with this client already exists');
    }

    return this.prisma.conversation.create({
      data: {
        title: createConversationDto.title || 'New Conversation',
        clientId: createConversationDto.clientId,
        therapistId,
        category: createConversationDto.category || 'general',
        priority: createConversationDto.priority || 'normal',
        createdBy: therapistId,
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  // Get messages for a conversation
  async getMessages(conversationId: string, therapistId: string) {
    // Verify conversation belongs to therapist
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: conversationId,
        therapistId,
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return this.prisma.message.findMany({
      where: {
        conversationId,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  // Send a message
  async sendMessage(createMessageDto: CreateMessageDto, senderId: string) {
    // Verify conversation exists and sender has access
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: createMessageDto.conversationId,
        OR: [
          { therapistId: senderId },
          { clientId: senderId },
        ],
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found or access denied');
    }

    // Create message
    const message = await this.prisma.message.create({
      data: {
        conversationId: createMessageDto.conversationId,
        senderId,
        content: createMessageDto.content,
        priority: createMessageDto.priority || 'normal',
        messageType: createMessageDto.messageType,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Update conversation's last message timestamp
    await this.prisma.conversation.update({
      where: {
        id: createMessageDto.conversationId,
      },
      data: {
        lastMessageAt: new Date(),
      },
    });

    return message;
  }

  // Find or create conversation for quick message
  async findOrCreateConversation(clientId: string, therapistId: string, category?: string, priority?: string) {
    let conversation = await this.prisma.conversation.findFirst({
      where: {
        clientId,
        therapistId,
      },
    });

    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: {
          title: 'Quick Message',
          clientId,
          therapistId,
          category: category || 'general',
          priority: priority || 'normal',
          createdBy: therapistId,
        },
      });
    }

    return conversation;
  }
} 