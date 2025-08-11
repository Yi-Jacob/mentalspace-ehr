import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

export interface NoteHistoryData {
  noteId: string;
  version: number;
  content: any;
  status?: string;
  title?: string;
  updatedContent?: boolean;
  updatedStatus?: boolean;
  updatedTitle?: boolean;
}

@Injectable()
export class NoteHistoryService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create initial history entry when a note is first created
   */
  async createInitialHistory(data: NoteHistoryData): Promise<void> {
    await this.prisma.noteHistory.create({
      data: {
        noteId: data.noteId,
        version: data.version,
        content: data.content,
        status: data.status,
        title: data.title,
        updatedContent: data.updatedContent ?? false,
        updatedStatus: data.updatedStatus ?? false,
        updatedTitle: data.updatedTitle ?? false,
      }
    });
  }

  /**
   * Create a new history entry when a note is updated
   */
  async createHistoryEntry(data: NoteHistoryData): Promise<void> {
    await this.prisma.noteHistory.create({
      data: {
        noteId: data.noteId,
        version: data.version,
        content: data.content,
        status: data.status,
        title: data.title,
        updatedContent: data.updatedContent ?? false,
        updatedStatus: data.updatedStatus ?? false,
        updatedTitle: data.updatedTitle ?? false,
      }
    });
  }

  /**
   * Get all history entries for a specific note
   */
  async getNoteHistory(noteId: string) {
    return this.prisma.noteHistory.findMany({
      where: { noteId },
      orderBy: { version: 'desc' },
      include: {
        note: {
          include: {
            client: {
              select: {
                firstName: true,
                lastName: true,
              }
            }
          }
        }
      }
    });
  }

  /**
   * Get a specific history entry by ID
   */
  async getHistoryEntry(entryId: string) {
    return this.prisma.noteHistory.findUnique({
      where: { id: entryId },
      include: {
        note: {
          include: {
            client: {
              select: {
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
                firstName: true,
                lastName: true,
              }
            }
          }
        }
      }
    });
  }

  /**
   * Get the latest version number for a note
   */
  async getLatestVersion(noteId: string): Promise<number> {
    const latestEntry = await this.prisma.noteHistory.findFirst({
      where: { noteId },
      orderBy: { version: 'desc' },
      select: { version: true }
    });

    return latestEntry?.version || 0;
  }

  /**
   * Determine what fields have changed between two versions
   */
  determineFieldChanges(
    oldData: { content: any; status?: string; title?: string },
    newData: { content: any; status?: string; title?: string }
  ) {
    return {
      updatedContent: JSON.stringify(oldData.content) !== JSON.stringify(newData.content),
      updatedStatus: oldData.status !== newData.status,
      updatedTitle: oldData.title !== newData.title,
    };
  }
}
