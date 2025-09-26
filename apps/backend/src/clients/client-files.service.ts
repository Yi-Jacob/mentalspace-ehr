import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateClientFileDto } from './dto/create-client-file.dto';
import { UpdateClientFileDto } from './dto/update-client-file.dto';
import { SignFileDto } from './dto/sign-file.dto';
import { CompleteFileDto } from './dto/complete-file.dto';
import { ShareFileDto } from './dto/share-file.dto';
import { FileStatus } from './enums/file-status.enum';
import { S3Service } from '../common/s3.service';

@Injectable()
export class ClientFilesService {
  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service,
  ) {}

  /**
   * Get all files for a specific client
   */
  async getForClient(clientId: string, userId: string) {
    // Verify the client exists
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    const clientUserId = await this.prisma.user.findUnique({
      where: { clientId: clientId },
      select: { id: true },
    });

    // Get files for the client
    const files = await this.prisma.clientFile.findMany({
      where: { clientId: clientUserId.id },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        coSigner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        file: {
          select: {
            id: true,
            fileName: true,
            fileUrl: true,
            fileSize: true,
            mimeType: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return files;
  }

  /**
   * Share a file with a client
   */
  async shareFile(createClientFileDto: CreateClientFileDto) {
    // Verify the client exists
    const client = await this.prisma.client.findUnique({
      where: { id: createClientFileDto.clientId },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    // Verify the creator exists
    const creator = await this.prisma.user.findUnique({
      where: { id: createClientFileDto.createdBy },
    });

    if (!creator) {
      throw new NotFoundException('Creator not found');
    }

    // Verify the file exists and is shareable
    const file = await this.prisma.file.findUnique({
      where: { id: createClientFileDto.fileId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    if (file.isForPatient || file.isForStaff) {
      throw new BadRequestException('This file is not available for sharing');
    }

    const clientUserId = await this.prisma.user.findUnique({
      where: { clientId: createClientFileDto.clientId },
      select: { id: true },
    });

    // Check if file is already shared with this client
    const existingClientFile = await this.prisma.clientFile.findFirst({
      where: {
        clientId: clientUserId.id,
        fileId: createClientFileDto.fileId,
      },
    });

    if (existingClientFile) {
      throw new BadRequestException('This file is already shared with this client');
    }

    // Create the client file record
    const clientFile = await this.prisma.clientFile.create({
      data: {
        clientId: clientUserId.id,
        fileId: createClientFileDto.fileId,
        notes: createClientFileDto.notes,
        status: createClientFileDto.status || FileStatus.DRAFT,
        createdBy: createClientFileDto.createdBy,
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        coSigner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        file: {
          select: {
            id: true,
            fileName: true,
            fileUrl: true,
            fileSize: true,
            mimeType: true,
          },
        },
      },
    });

    return clientFile;
  }

  /**
   * Get shareable files (not for patient and not for staff)
   */
  async getShareableFiles() {
    const files = await this.prisma.file.findMany({
      where: {
        isForPatient: false,
        isForStaff: false,
      },
      select: {
        id: true,
        fileName: true,
        fileUrl: true,
        fileSize: true,
        mimeType: true,
        createdAt: true,
        creator: {
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
    });

    return files;
  }

  /**
   * Sign a file by the author
   */
  async signByAuthor(signFileDto: SignFileDto) {
    const { fileId, signedBy } = signFileDto;

    // Get the file
    const file = await this.prisma.clientFile.findUnique({
      where: { id: fileId },
      include: {
        creator: true,
      },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    // Verify the signer is the creator
    if (file.createdBy !== signedBy) {
      throw new ForbiddenException('Only the file creator can sign the file');
    }

    // Check if file is already signed
    if (file.status !== FileStatus.DRAFT) {
      throw new BadRequestException('File is already signed');
    }

    // Check if the creator has a supervisor
    const creatorUser = await this.prisma.user.findUnique({
      where: {
        id: signedBy,
      },
      include: {
        supervisionAsSupervisee: {
          where: {
            status: 'active',
          },
          include: {
            supervisor: true,
          },
        },
      },
    });

    let newStatus = FileStatus.SIGNED_BY_AUTHOR;
    let isCompletedOnStaff = false;

    // If creator has no supervisor, mark as completed on staff
    if (!creatorUser || creatorUser.supervisionAsSupervisee.length === 0) {
      isCompletedOnStaff = true;
    }

    // Update the file
    const updatedFile = await this.prisma.clientFile.update({
      where: { id: fileId },
      data: {
        status: newStatus,
        signedDate: new Date(),
        isCompletedOnStaff,
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        coSigner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        file: {
          select: {
            id: true,
            fileName: true,
            fileUrl: true,
            fileSize: true,
            mimeType: true,
          },
        },
      },
    });

    return updatedFile;
  }

  /**
   * Complete a file by the client
   */
  async completeByClient(completeFileDto: CompleteFileDto) {
    const { fileId, completedBy } = completeFileDto;

    // Get the file
    const file = await this.prisma.clientFile.findUnique({
      where: { id: fileId },
      include: {
        client: true,
      },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    // Verify the completer is the client
    if (file.clientId !== completedBy) {
      throw new ForbiddenException('Only the client can complete the file');
    }

    // Check if file is ready for completion (signed by author and supervisor if needed)
    if (file.status !== FileStatus.SIGNED_BY_AUTHOR && file.status !== FileStatus.SIGNED_BY_SUPERVISOR) {
      throw new BadRequestException('File must be signed before completion');
    }

    // Check if staff completion is required
    if (!file.isCompletedOnStaff) {
      throw new BadRequestException('File must be completed by staff before client completion');
    }

    // Update the file
    const updatedFile = await this.prisma.clientFile.update({
      where: { id: fileId },
      data: {
        status: FileStatus.COMPLETED_BY_CLIENT,
        completedDate: new Date(),
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        coSigner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        file: {
          select: {
            id: true,
            fileName: true,
            fileUrl: true,
            fileSize: true,
            mimeType: true,
          },
        },
      },
    });

    return updatedFile;
  }

  /**
   * Co-sign a file by supervisor
   */
  async coSignFile(fileId: string, coSignedBy: string) {
    // Get the file
    const file = await this.prisma.clientFile.findUnique({
      where: { id: fileId },
      include: {
        creator: {
          include: {
            supervisionAsSupervisee: {
              where: {
                status: 'active',
              },
              include: {
                supervisor: true,
              },
            },
          },
        },
      },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    // Check if file is signed by author
    if (file.status !== FileStatus.SIGNED_BY_AUTHOR) {
      throw new BadRequestException('File must be signed by author before co-signing');
    }

    // Verify the co-signer is the supervisor of the file creator
    const supervisionRelationship = file.creator.supervisionAsSupervisee.find(
      (rel) => rel.supervisor.id === coSignedBy
    );

    if (!supervisionRelationship) {
      throw new ForbiddenException('Only the supervisor can co-sign this file');
    }

    // Update the file
    const updatedFile = await this.prisma.clientFile.update({
      where: { id: fileId },
      data: {
        status: FileStatus.SIGNED_BY_SUPERVISOR,
        coSignedBy,
        coSignedByDate: new Date(),
        isCompletedOnStaff: true,
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        coSigner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        file: {
          select: {
            id: true,
            fileName: true,
            fileUrl: true,
            fileSize: true,
            mimeType: true,
          },
        },
      },
    });

    return updatedFile;
  }

  /**
   * Get a single file by ID
   */
  async getFileById(fileId: string) {
    const file = await this.prisma.clientFile.findUnique({
      where: { id: fileId },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        coSigner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        file: {
          select: {
            id: true,
            fileName: true,
            fileUrl: true,
            fileSize: true,
            mimeType: true,
          },
        },
      },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return file;
  }

  /**
   * Get download URL for a file
   */
  async getDownloadUrl(fileId: string): Promise<{ downloadUrl: string }> {
    const clientFile = await this.prisma.clientFile.findUnique({
      where: { id: fileId },
      include: {
        file: true,
      },
    });

    if (!clientFile) {
      throw new NotFoundException('File not found');
    }

    // Extract the S3 key from the file URL
    const url = new URL(clientFile.file.fileUrl);
    const s3Key = url.pathname.substring(1); // Remove leading slash

    // Generate signed URL for download (expires in 1 hour)
    const downloadUrl = await this.s3Service.getSignedDownloadUrl(s3Key, 3600);

    return { downloadUrl };
  }

  /**
   * Delete a file
   */
  async deleteFile(fileId: string, userId: string) {
    const file = await this.prisma.clientFile.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    // Only allow deletion by the creator or if file is in draft status
    if (file.createdBy !== userId && file.status !== FileStatus.DRAFT) {
      throw new ForbiddenException('Only the file creator can delete this file');
    }

    await this.prisma.clientFile.delete({
      where: { id: fileId },
    });

    return { message: 'File deleted successfully' };
  }
}
