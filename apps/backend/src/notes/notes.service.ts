import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateNoteDto, UpdateNoteDto, QueryNotesDto, NoteStatus } from './dto';
import { NoteEntity } from './entities/note.entity';
import { NoteHistoryService } from './note-history.service';

@Injectable()
export class NotesService {
  constructor(
    private prisma: PrismaService,
    private noteHistoryService: NoteHistoryService
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

  async findAll(queryDto: QueryNotesDto): Promise<{ notes: NoteEntity[]; total: number }> {
    const { page = 1, limit = 10, clientId, noteType, status } = queryDto;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (clientId) where.clientId = clientId;
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

  async findPendingApprovals(): Promise<NoteEntity[]> {
    const notes = await this.prisma.clinicalNote.findMany({
      where: {
        status: NoteStatus.PENDING_REVIEW
      },
      orderBy: { updatedAt: 'asc' },
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
    });

    return notes.map(note => this.mapToEntity(note));
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

    if (existingNote.status === NoteStatus.SIGNED) {
      throw new BadRequestException('Cannot update a signed note. Create an addendum instead.');
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

    if (existingNote.status === NoteStatus.SIGNED) {
      throw new BadRequestException('Cannot update a signed note. Create an addendum instead.');
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

  async submitForReview(id: string): Promise<NoteEntity> {
    const existingNote = await this.prisma.clinicalNote.findUnique({
      where: { id },
    });

    if (!existingNote) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    if (existingNote.status !== NoteStatus.DRAFT) {
      throw new BadRequestException('Only draft notes can be submitted for review');
    }

    const note = await this.prisma.clinicalNote.update({
      where: { id },
      data: {
        status: NoteStatus.PENDING_REVIEW,
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
        }
      }
    });

    return this.mapToEntity(note);
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

    const note = await this.prisma.clinicalNote.update({
      where: { id },
      data: {
        status: NoteStatus.SIGNED,
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
        }
      }
    });

    return this.mapToEntity(note);
  }

  async coSign(id: string, coSignedBy: string): Promise<NoteEntity> {
    const existingNote = await this.prisma.clinicalNote.findUnique({
      where: { id },
    });

    if (!existingNote) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    if (existingNote.status !== NoteStatus.SIGNED) {
      throw new BadRequestException('Only signed notes can be marked for co-signature');
    }

    const note = await this.prisma.clinicalNote.update({
      where: { id },
      data: {
        status: NoteStatus.PENDING_REVIEW,
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
        }
      }
    });

    return this.mapToEntity(note);
  }

  async lockNote(id: string): Promise<NoteEntity> {
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
        }
      }
    });

    return this.mapToEntity(note);
  }

  async unlockNote(id: string): Promise<NoteEntity> {
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
      signedBy: note.signedBy,
      approvedAt: note.approvedAt,
      approvedBy: note.approvedBy,
      coSignedAt: note.coSignedAt,
      coSignedBy: note.coSignedBy,
      lockedAt: note.lockedAt,
      version: note.version,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      client: note.client,
      provider: note.provider,
    };
  }
} 