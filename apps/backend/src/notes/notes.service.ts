import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateNoteDto, UpdateNoteDto, QueryNotesDto, NoteStatus } from './dto';
import { NoteEntity } from './entities/note.entity';
import { NoteHistoryService } from './note-history.service';
import { NotificationService } from '../common/notification.service';

@Injectable()
export class NotesService {
  constructor(
    private prisma: PrismaService,
    private noteHistoryService: NoteHistoryService,
    private notificationService: NotificationService
  ) {}

  async createNote(createNoteDto: CreateNoteDto, providerId: string): Promise<NoteEntity> {
    const note = await this.prisma.clinicalNote.create({
      data: {
        title: createNoteDto.title,
        content: createNoteDto.content,
        clientId: createNoteDto.clientId,
        providerId,
        noteType: createNoteDto.noteType,
        status: createNoteDto.status || NoteStatus.DRAFT,
        version: 1,
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            dateOfBirth: true,
            email: true,
            address1: true,
            address2: true,
            city: true,
            state: true,
            zipCode: true,
            genderIdentity: true,
          }
        },
        provider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        signer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        coSigner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        locker: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        unlocker: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        }
      }
    });

    // Create initial history entry
    await this.noteHistoryService.createInitialHistory({
      noteId: note.id,
      version: 1,
      content: createNoteDto.content,
      status: createNoteDto.status || NoteStatus.DRAFT,
      title: createNoteDto.title,
      updatedContent: false,
      updatedStatus: false,
      updatedTitle: false,
    });

    return this.mapToEntity(note);
  }

  async findAll(queryDto: QueryNotesDto, userId?: string, userRoles?: string[]): Promise<{ notes: NoteEntity[]; total: number }> {
    const { page = 1, limit = 10, clientId, noteType, status } = queryDto;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (clientId) where.clientId = clientId;
    if (noteType) where.noteType = noteType;
    if (status) where.status = status;

    // Define role groups
    const adminRoles = ['Practice Administrator', 'Clinical Administrator'];
    
    // Check if user has admin roles - full access to all notes
    if (userRoles && userRoles.some(role => adminRoles.includes(role))) {
      // Admin users can see all notes, no additional filtering needed
    } else if (userId) {
      // Non-admin users: include notes from supervisees
      const superviseeIds = await this.getSuperviseeIds(userId);
      where.providerId = {
        in: [userId, ...superviseeIds]
      };
    }

    const [notes, total] = await Promise.all([
      this.prisma.clinicalNote.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          client: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              dateOfBirth: true,
              email: true,
              address1: true,
              address2: true,
              city: true,
              state: true,
              zipCode: true,
              genderIdentity: true,
            }
          },
          provider: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            }
          }
        }
      }),
      this.prisma.clinicalNote.count({ where }),
    ]);

    return {
      notes: notes.map(note => this.mapToEntity(note)),
      total,
    };
  }

  async findOne(id: string): Promise<NoteEntity> {
    const note = await this.prisma.clinicalNote.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            dateOfBirth: true,
            email: true,
            address1: true,
            address2: true,
            city: true,
            state: true,
            zipCode: true,
            genderIdentity: true,
          }
        },
        provider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        signer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        coSigner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        locker: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        unlocker: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        }
      }
    });

    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    return this.mapToEntity(note);
  }

  async findByClient(clientId: string, queryDto: QueryNotesDto): Promise<{ notes: NoteEntity[]; total: number }> {
    const { page = 1, limit = 10, noteType, status } = queryDto;
    const skip = (page - 1) * limit;

    const where: any = { clientId };
    if (noteType) where.noteType = noteType;
    if (status) where.status = status;

    const [notes, total] = await Promise.all([
      this.prisma.clinicalNote.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          client: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              dateOfBirth: true,
              email: true,
              address1: true,
              address2: true,
              city: true,
              state: true,
              zipCode: true,
              genderIdentity: true,
            }
          },
          provider: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            }
          }
        }
      }),
      this.prisma.clinicalNote.count({ where }),
    ]);

    return {
      notes: notes.map(note => this.mapToEntity(note)),
      total,
    };
  }

  async updateNote(id: string, updateNoteDto: UpdateNoteDto): Promise<NoteEntity> {
    const existingNote = await this.prisma.clinicalNote.findUnique({
      where: { id },
    });

    if (!existingNote) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    if (existingNote.status === NoteStatus.LOCKED) {
      throw new BadRequestException('Cannot update a locked note');
    }

    if (existingNote.status === NoteStatus.ACCEPTED) {
      throw new BadRequestException('Cannot update an accepted note. Create an addendum instead.');
    }

    // Get the next version number
    const nextVersion = (existingNote.version || 1) + 1;

    const note = await this.prisma.clinicalNote.update({
      where: { id },
      data: {
        ...updateNoteDto,
        version: nextVersion,
        updatedAt: new Date(),
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            dateOfBirth: true,
            email: true,
            address1: true,
            address2: true,
            city: true,
            state: true,
            zipCode: true,
            genderIdentity: true,
          }
        },
        provider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        signer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        coSigner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        locker: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        unlocker: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        }
      }
    });

    // Determine what fields have changed
    const fieldChanges = this.noteHistoryService.determineFieldChanges(
      { content: existingNote.content, status: existingNote.status, title: existingNote.title },
      { content: updateNoteDto.content, status: updateNoteDto.status, title: updateNoteDto.title }
    );

    // Create version history entry
    await this.noteHistoryService.createHistoryEntry({
      noteId: note.id,
      version: nextVersion,
      content: updateNoteDto.content || existingNote.content,
      status: updateNoteDto.status || existingNote.status,
      title: updateNoteDto.title || existingNote.title,
      ...fieldChanges,
    });

    return this.mapToEntity(note);
  }

  async saveDraft(id: string, updateNoteDto: UpdateNoteDto, providerId: string): Promise<NoteEntity> {
    const existingNote = await this.prisma.clinicalNote.findUnique({
      where: { id },
    });

    if (!existingNote) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    if (existingNote.status === NoteStatus.LOCKED) {
      throw new BadRequestException('Cannot update a locked note');
    }

    if (existingNote.status === NoteStatus.ACCEPTED) {
      throw new BadRequestException('Cannot update an accepted note. Create an addendum instead.');
    }

    // Get the next version number
    const nextVersion = (existingNote.version || 1) + 1;

    const note = await this.prisma.clinicalNote.update({
      where: { id },
      data: {
        ...updateNoteDto,
        status: NoteStatus.DRAFT,
        providerId,
        version: nextVersion,
        updatedAt: new Date(),
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            dateOfBirth: true,
            email: true,
            address1: true,
            address2: true,
            city: true,
            state: true,
            zipCode: true,
            genderIdentity: true,
          }
        },
        provider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        signer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        coSigner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        locker: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        unlocker: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        }
      }
    });

    // Determine what fields have changed
    const fieldChanges = this.noteHistoryService.determineFieldChanges(
      { content: existingNote.content, status: existingNote.status, title: existingNote.title },
      { content: updateNoteDto.content, status: updateNoteDto.status, title: updateNoteDto.title }
    );

    // Create version history entry
    await this.noteHistoryService.createHistoryEntry({
      noteId: note.id,
      version: nextVersion,
      content: updateNoteDto.content || existingNote.content,
      status: updateNoteDto.status || existingNote.status,
      title: updateNoteDto.title || existingNote.title,
      ...fieldChanges,
    });

    return this.mapToEntity(note);
  }

  async deleteNote(id: string): Promise<void> {
    const existingNote = await this.prisma.clinicalNote.findUnique({
      where: { id },
    });

    if (!existingNote) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    await this.prisma.clinicalNote.delete({
      where: { id },
    });
  }


  async signNote(id: string, signedBy: string): Promise<NoteEntity> {
    const existingNote = await this.prisma.clinicalNote.findUnique({
      where: { id },
    });

    if (!existingNote) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    if (existingNote.status === NoteStatus.LOCKED) {
      throw new BadRequestException('Cannot sign a locked note');
    }

    if (existingNote.status !== NoteStatus.DRAFT) {
      throw new BadRequestException('Only draft notes can be signed');
    }

    // Check if the provider has supervisors (is a supervisee)
    const supervisorIds = await this.getSupervisorIds(existingNote.providerId);
    
    // Determine the next status based on whether provider has supervisors
    const nextStatus = supervisorIds.length > 0 ? NoteStatus.PENDING_CO_SIGN : NoteStatus.ACCEPTED;

    const note = await this.prisma.clinicalNote.update({
      where: { id },
      data: {
        status: nextStatus,
        signedBy,
        signedAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            dateOfBirth: true,
            email: true,
            address1: true,
            address2: true,
            city: true,
            state: true,
            zipCode: true,
            genderIdentity: true,
          }
        },
        provider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        signer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        coSigner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        locker: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        unlocker: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        }
      }
    });

    // Create notifications for note signing
    try {
      // Get supervisor details for notifications
      const supervisors = await this.prisma.user.findMany({
        where: { id: { in: supervisorIds } },
        select: { id: true, firstName: true, lastName: true }
      });

      const noteTitle = note.title;
      const clientName = `${note.client.firstName} ${note.client.lastName}`;
      const providerName = `${note.provider.firstName} ${note.provider.lastName}`;

      // Notify supervisors if note needs co-signature
      if (supervisors.length > 0) {
        const notifications = supervisors.map(supervisor => 
          this.notificationService.createNoteNotification(
            supervisor.id,
            note.id,
            `Clinical note "${noteTitle}" for ${clientName} by ${providerName} requires your co-signature`,
            'signed'
          )
        );
        await Promise.all(notifications);
      }
    } catch (error) {
      console.error('Error creating note signing notifications:', error);
      // Don't fail the note signing if notifications fail
    }

    return this.mapToEntity(note);
  }

  async coSign(id: string, coSignedBy: string): Promise<NoteEntity> {
    const existingNote = await this.prisma.clinicalNote.findUnique({
      where: { id },
    });

    if (!existingNote) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    if (existingNote.status !== NoteStatus.PENDING_CO_SIGN) {
      throw new BadRequestException('Only notes pending co-signature can be co-signed');
    }

    // Verify that the co-signer is a supervisor of the note provider
    const superviseeIds = await this.getSuperviseeIds(coSignedBy);
    if (!superviseeIds.includes(existingNote.providerId)) {
      throw new BadRequestException('You can only co-sign notes from your supervisees');
    }

    const note = await this.prisma.clinicalNote.update({
      where: { id },
      data: {
        status: NoteStatus.ACCEPTED,
        coSignedBy,
        coSignedAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            dateOfBirth: true,
            email: true,
            address1: true,
            address2: true,
            city: true,
            state: true,
            zipCode: true,
            genderIdentity: true,
          }
        },
        provider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        signer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        coSigner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        locker: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        unlocker: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        }
      }
    });

    return this.mapToEntity(note);
  }

  async lockNote(id: string, lockedBy?: string): Promise<NoteEntity> {
    const existingNote = await this.prisma.clinicalNote.findUnique({
      where: { id },
    });

    if (!existingNote) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    const note = await this.prisma.clinicalNote.update({
      where: { id },
      data: {
        status: NoteStatus.LOCKED,
        lockedAt: new Date(),
        lockedBy: lockedBy || null,
        updatedAt: new Date(),
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            dateOfBirth: true,
            email: true,
            address1: true,
            address2: true,
            city: true,
            state: true,
            zipCode: true,
            genderIdentity: true,
          }
        },
        provider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        signer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        coSigner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        locker: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        unlocker: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        }
      }
    });

    return this.mapToEntity(note);
  }

  async unlockNote(id: string, unlockedBy?: string): Promise<NoteEntity> {
    const existingNote = await this.prisma.clinicalNote.findUnique({
      where: { id },
    });

    if (!existingNote) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    const note = await this.prisma.clinicalNote.update({
      where: { id },
      data: {
        status: NoteStatus.DRAFT,
        unlockedAt: new Date(),
        unlockedBy: unlockedBy || null,
        updatedAt: new Date(),
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            dateOfBirth: true,
            email: true,
            address1: true,
            address2: true,
            city: true,
            state: true,
            zipCode: true,
            genderIdentity: true,
          }
        },
        provider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        signer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        coSigner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        locker: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        unlocker: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        }
      }
    });

    return this.mapToEntity(note);
  }

  async getNoteHistory(noteId: string): Promise<any[]> {
    const history = await this.noteHistoryService.getNoteHistory(noteId);

    return history.map(entry => ({
      ...entry,
      note_title: entry.note.title,
      note_type: entry.note.noteType,
      first_name: entry.note.client.firstName,
      last_name: entry.note.client.lastName,
    }));
  }

  async getNoteHistoryVersion(noteId: string, versionId: string): Promise<any> {
    const historyEntry = await this.noteHistoryService.getHistoryEntry(versionId);

    if (!historyEntry) {
      throw new NotFoundException(`History entry with ID ${versionId} not found`);
    }

    return {
      ...historyEntry,
      note_title: historyEntry.note.title,
      note_type: historyEntry.note.noteType,
      first_name: historyEntry.note.client.firstName,
      last_name: historyEntry.note.client.lastName,
      date_of_birth: historyEntry.note.client.dateOfBirth,
      email: historyEntry.note.client.email,
      address1: historyEntry.note.client.address1,
      address2: historyEntry.note.client.address2,
      city: historyEntry.note.client.city,
      state: historyEntry.note.client.state,
      zip_code: historyEntry.note.client.zipCode,
      gender_identity: historyEntry.note.client.genderIdentity,
      provider_first_name: historyEntry.note.provider.firstName,
      provider_last_name: historyEntry.note.provider.lastName,
    };
  }

  private async getSuperviseeIds(supervisorId: string): Promise<string[]> {
    const supervisionRelationships = await this.prisma.supervisionRelationship.findMany({
      where: {
        supervisorId,
        status: 'active',
        OR: [
          { endDate: null },
          { endDate: { gt: new Date() } }
        ]
      },
      select: {
        superviseeId: true
      }
    });

    return supervisionRelationships.map(rel => rel.superviseeId);
  }

  private async getSupervisorIds(superviseeId: string): Promise<string[]> {
    const supervisionRelationships = await this.prisma.supervisionRelationship.findMany({
      where: {
        superviseeId,
        status: 'active',
        OR: [
          { endDate: null },
          { endDate: { gt: new Date() } }
        ]
      },
      select: {
        supervisorId: true
      }
    });

    return supervisionRelationships.map(rel => rel.supervisorId);
  }

  private mapToEntity(note: any): NoteEntity {
    return {
      id: note.id,
      title: note.title,
      content: note.content,
      clientId: note.clientId,
      providerId: note.providerId,
      noteType: note.noteType,
      status: note.status,
      signedAt: note.signedAt,
      signedBy: note.signer ? `${note.signer.firstName} ${note.signer.lastName}` : note.signedBy,
      coSignedAt: note.coSignedAt,
      coSignedBy: note.coSigner ? `${note.coSigner.firstName} ${note.coSigner.lastName}` : note.coSignedBy,
      lockedAt: note.lockedAt,
      lockedBy: note.locker ? `${note.locker.firstName} ${note.locker.lastName}` : note.lockedBy,
      unlockedAt: note.unlockedAt,
      unlockedBy: note.unlocker ? `${note.unlocker.firstName} ${note.unlocker.lastName}` : note.unlockedBy,
      version: note.version,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      client: note.client,
      provider: note.provider,
    };
  }
} 