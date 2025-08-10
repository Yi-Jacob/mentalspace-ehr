import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateNoteDto, UpdateNoteDto, QueryNotesDto, NoteStatus } from './dto';
import { NoteEntity } from './entities/note.entity';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async createNote(createNoteDto: CreateNoteDto, providerId: string): Promise<NoteEntity> {
    const note = await this.prisma.clinicalNote.create({
      data: {
        title: createNoteDto.title,
        content: createNoteDto.content,
        clientId: createNoteDto.clientId,
        providerId,
        noteType: createNoteDto.noteType,
        status: createNoteDto.status || NoteStatus.DRAFT,
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

    const note = await this.prisma.clinicalNote.update({
      where: { id },
      data: {
        ...updateNoteDto,
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

    const note = await this.prisma.clinicalNote.update({
      where: { id },
      data: {
        ...updateNoteDto,
        status: NoteStatus.DRAFT,
        providerId,
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