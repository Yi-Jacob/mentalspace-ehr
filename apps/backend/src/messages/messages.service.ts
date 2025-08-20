import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateConversationDto, CreateGroupConversationDto, CreateMessageDto, MarkMessageReadDto } from './dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  // Get all conversations for a user (both individual and group)
  async getConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: {
        OR: [
          { therapistId: userId },
          { clientId: userId },
          {
            participants: {
              some: {
                userId,
                leftAt: null,
              },
            },
          },
        ],
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        therapist: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        participants: {
          where: {
            leftAt: null,
          },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
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
  async getConversation(id: string, userId: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id,
        OR: [
          { therapistId: userId },
          { clientId: userId },
          {
            participants: {
              some: {
                userId,
                leftAt: null,
              },
            },
          },
        ],
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        therapist: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        participants: {
          where: {
            leftAt: null,
          },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }

  // Create a new individual conversation
  async createConversation(createConversationDto: CreateConversationDto, therapistId: string) {
    // Check if conversation already exists
    const existingConversation = await this.prisma.conversation.findFirst({
      where: {
        clientId: createConversationDto.clientId,
        therapistId,
        type: 'individual',
      },
    });

    if (existingConversation) {
      throw new ConflictException('A conversation with this client already exists');
    }

    return this.prisma.conversation.create({
      data: {
        title: createConversationDto.title || 'New Conversation',
        type: 'individual',
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
        therapist: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  // Create a new group conversation
  async createGroupConversation(createGroupConversationDto: CreateGroupConversationDto, creatorId: string) {
    // Verify all participants exist
    const participants = await this.prisma.user.findMany({
      where: {
        id: {
          in: createGroupConversationDto.participantIds,
        },
      },
    });

    if (participants.length !== createGroupConversationDto.participantIds.length) {
      throw new NotFoundException('One or more participants not found');
    }

    // Create conversation and participants in a transaction
    return this.prisma.$transaction(async (prisma) => {
      const conversation = await prisma.conversation.create({
        data: {
          title: createGroupConversationDto.title,
          type: 'group',
          category: createGroupConversationDto.category || 'general',
          priority: createGroupConversationDto.priority || 'normal',
          createdBy: creatorId,
        },
      });

      // Add all participants including creator
      const participantData = createGroupConversationDto.participantIds.map((participantId) => ({
        conversationId: conversation.id,
        userId: participantId,
        role: participantId === creatorId ? 'admin' : 'participant',
      }));

      await prisma.conversationParticipant.createMany({
        data: participantData,
      });

      return prisma.conversation.findUnique({
        where: { id: conversation.id },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });
    });
  }

  // Get messages for a conversation
  async getMessages(conversationId: string, userId: string) {
    // Verify conversation access
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          { therapistId: userId },
          { clientId: userId },
          {
            participants: {
              some: {
                userId,
                leftAt: null,
              },
            },
          },
        ],
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
        replyTo: {
          select: {
            id: true,
            content: true,
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        readReceipts: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
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
          {
            participants: {
              some: {
                userId: senderId,
                leftAt: null,
              },
            },
          },
        ],
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found or access denied');
    }

    // If this is a reply, verify the original message exists
    if (createMessageDto.replyToId) {
      const originalMessage = await this.prisma.message.findFirst({
        where: {
          id: createMessageDto.replyToId,
          conversationId: createMessageDto.conversationId,
        },
      });

      if (!originalMessage) {
        throw new NotFoundException('Original message not found');
      }
    }

    // Create message
    const message = await this.prisma.message.create({
      data: {
        conversationId: createMessageDto.conversationId,
        senderId,
        content: createMessageDto.content,
        priority: createMessageDto.priority || 'normal',
        messageType: createMessageDto.messageType,
        replyToId: createMessageDto.replyToId,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        replyTo: {
          select: {
            id: true,
            content: true,
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
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

  // Mark message as read
  async markMessageAsRead(markReadDto: MarkMessageReadDto, userId: string) {
    // Verify message exists and user has access to the conversation
    const message = await this.prisma.message.findFirst({
      where: {
        id: markReadDto.messageId,
        conversation: {
          OR: [
            { therapistId: userId },
            { clientId: userId },
            {
              participants: {
                some: {
                  userId,
                  leftAt: null,
                },
              },
            },
          ],
        },
      },
    });

    if (!message) {
      throw new NotFoundException('Message not found or access denied');
    }

    // Create or update read receipt
    return this.prisma.messageReadReceipt.upsert({
      where: {
        messageId_userId: {
          messageId: markReadDto.messageId,
          userId,
        },
      },
      update: {
        readAt: new Date(),
      },
      create: {
        messageId: markReadDto.messageId,
        userId,
        readAt: new Date(),
      },
    });
  }

  // Find or create conversation for quick message
  async findOrCreateConversation(clientId: string, therapistId: string, category?: string, priority?: string) {
    let conversation = await this.prisma.conversation.findFirst({
      where: {
        clientId,
        therapistId,
        type: 'individual',
      },
    });

    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: {
          title: 'Quick Message',
          type: 'individual',
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

  // Create conversation with initial message
  async createConversationWithMessage(
    data: {
      title: string;
      participantIds: string[];
      category?: string;
      priority?: string;
      initialMessage: string;
      type: 'individual' | 'group';
    },
    creatorId: string
  ) {
    return this.prisma.$transaction(async (prisma) => {
      // Create conversation
      const conversation = await prisma.conversation.create({
        data: {
          title: data.title,
          type: data.type,
          category: data.category || 'general',
          priority: data.priority || 'normal',
          createdBy: creatorId,
          // For individual conversations, set clientId and therapistId
          ...(data.type === 'individual' && data.participantIds.length === 2 && {
            clientId: data.participantIds.find(id => id !== creatorId),
            therapistId: creatorId,
          }),
        },
      });

      // Add participants for group conversations
      if (data.type === 'group') {
        const participantData = data.participantIds.map((participantId) => ({
          conversationId: conversation.id,
          userId: participantId,
          role: participantId === creatorId ? 'admin' : 'participant',
        }));

        await prisma.conversationParticipant.createMany({
          data: participantData,
        });
      }

      // Send initial message
      const message = await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId: creatorId,
          content: data.initialMessage,
          priority: data.priority || 'normal',
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
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { lastMessageAt: new Date() },
      });

      return {
        conversation,
        message,
      };
    });
  }

  // Get unread message count for a user
  async getUnreadMessageCount(userId: string) {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        OR: [
          { therapistId: userId },
          { clientId: userId },
          {
            participants: {
              some: {
                userId,
                leftAt: null,
              },
            },
          },
        ],
      },
      select: {
        id: true,
      },
    });

    const conversationIds = conversations.map(c => c.id);

    const unreadCount = await this.prisma.message.count({
      where: {
        conversationId: {
          in: conversationIds,
        },
        senderId: {
          not: userId,
        },
        readReceipts: {
          none: {
            userId,
          },
        },
      },
    });

    return unreadCount;
  }
} 