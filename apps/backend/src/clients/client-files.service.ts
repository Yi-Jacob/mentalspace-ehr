import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateClientFileDto } from './dto/create-client-file.dto';
import { UpdateClientFileDto } from './dto/update-client-file.dto';
import { CompleteFileDto } from './dto/complete-file.dto';
import { ShareFileDto } from './dto/share-file.dto';
import { SharePortalFormDto } from './dto/share-portal-form.dto';
import { FileStatus } from './enums/file-status.enum';
import { S3Service } from '../common/s3.service';
import { NotificationService } from '../common/notification.service';

@Injectable()
export class ClientFilesService {
  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service,
    private notificationService: NotificationService,
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

    if (!clientUserId) {
      throw new NotFoundException('Client user not found');
    }

    // Check if the requesting user is the client or has permission to access client files
    const requestingUser = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        client: true,
        staffProfile: true,
      },
    });

    if (!requestingUser) {
      throw new NotFoundException('User not found');
    }

    // Allow access if:
    // 1. The user is the client themselves
    // 2. The user is staff (they can access any client's files)
    const isClient = requestingUser.clientId === clientId;
    const isStaff = requestingUser.staffProfile !== null;

    if (!isClient && !isStaff) {
      throw new ForbiddenException('You can only access your own files');
    }

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
        file: {
          select: {
            id: true,
            fileName: true,
            fileUrl: true,
            fileSize: true,
            mimeType: true,
          },
        },
        portalForm: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
        outcomeMeasure: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
        portalFormResponse: {
          select: {
            id: true,
            content: true,
            signature: true,
          },
        },
        outcomeMeasureResponse: {
          select: {
            id: true,
            responses: true,
            totalScore: true,
            criteria: true,
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

    // Send notification to client
    try {
      const creatorName = `${clientFile.creator.firstName} ${clientFile.creator.lastName}`;
      const fileName = clientFile.file.fileName;
      
      await this.notificationService.createNotification({
        receiverId: clientUserId.id,
        content: `${creatorName} has shared a file with you: ${fileName}`,
        associatedLink: '/files',
      });
    } catch (error) {
      console.error('Error creating notification for file sharing:', error);
      // Don't fail the file sharing if notification fails
    }

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
   * Get shareable portal forms
   */
  async getShareablePortalForms() {
    const forms = await this.prisma.portalForm.findMany({
      where: {
        sharable: 'sharable',
      },
      select: {
        id: true,
        title: true,
        description: true,
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

    return forms;
  }

  /**
   * Get shareable outcome measures
   */
  async getShareableOutcomeMeasures() {
    const measures = await this.prisma.outcomeMeasure.findMany({
      where: {
        sharable: 'sharable',
      },
      select: {
        id: true,
        title: true,
        description: true,
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

    return measures;
  }

  /**
   * Share a portal form with a client
   */
  async sharePortalForm(clientId: string, shareFormDto: SharePortalFormDto) {
    const { portalFormId, notes } = shareFormDto;

    // Check if portal form exists and is shareable
    const portalForm = await this.prisma.portalForm.findUnique({
      where: { id: portalFormId },
    });

    if (!portalForm) {
      throw new NotFoundException('Portal form not found');
    }

    if (portalForm.sharable !== 'sharable') {
      throw new BadRequestException('Portal form is not shareable');
    }

    // Check if already shared
    const existingShare = await this.prisma.clientFile.findFirst({
      where: {
        clientId,
        portalFormId,
      },
    });

    if (existingShare) {
      throw new BadRequestException('Portal form is already shared with this client');
    }

    const clientUserId = await this.prisma.user.findUnique({
      where: { clientId: clientId },
      select: { id: true },
    });

    // Create client file record for portal form
    const clientFile = await this.prisma.clientFile.create({
      data: {
        clientId: clientUserId.id,
        portalFormId,
        notes: notes || undefined,
        status: 'draft',
        createdBy: portalForm.createdBy,
      },
      include: {
        portalForm: {
          select: {
            id: true,
            title: true,
            description: true,
            createdAt: true,
            creator: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Create portal form response record linked to the client file
    await this.prisma.portalFormResponse.create({
      data: {
        clientFileId: clientFile.id,
        content: {}, // Empty content initially, will be filled when client submits
        signature: null, // No signature initially
      },
    });

    // Send notification to client
    try {
      const creatorName = `${clientFile.creator.firstName} ${clientFile.creator.lastName}`;
      const formTitle = clientFile.portalForm.title;
      
      await this.notificationService.createNotification({
        receiverId: clientUserId.id,
        content: `${creatorName} has shared a form with you: ${formTitle}`,
        associatedLink: '/files',
      });
    } catch (error) {
      console.error('Error creating notification for portal form sharing:', error);
      // Don't fail the form sharing if notification fails
    }

    return clientFile;
  }

  /**
   * Share an outcome measure with a client
   */
  async shareOutcomeMeasure(clientId: string, shareMeasureDto: { outcomeMeasureId: string; notes?: string }) {
    const { outcomeMeasureId, notes } = shareMeasureDto;

    // Check if outcome measure exists and is shareable
    const outcomeMeasure = await this.prisma.outcomeMeasure.findUnique({
      where: { id: outcomeMeasureId },
    });

    if (!outcomeMeasure) {
      throw new NotFoundException('Outcome measure not found');
    }

    if (outcomeMeasure.sharable !== 'sharable') {
      throw new BadRequestException('Outcome measure is not shareable');
    }

    const clientUserId = await this.prisma.user.findUnique({
      where: { clientId: clientId },
      select: { id: true },
    });

    // Check if already shared
    const existingShare = await this.prisma.clientFile.findFirst({
      where: {
        clientId: clientUserId.id,
        outcomeMeasureId,
      },
    });

    if (existingShare) {
      throw new BadRequestException('Outcome measure is already shared with this client');
    }

    // Create client file record for outcome measure
    const clientFile = await this.prisma.clientFile.create({
      data: {
        clientId: clientUserId.id,
        outcomeMeasureId,
        notes: notes || undefined,
        status: 'draft',
        createdBy: outcomeMeasure.createdBy,
      },
      include: {
        outcomeMeasure: {
          select: {
            id: true,
            title: true,
            description: true,
            createdAt: true,
            creator: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Create outcome measure response record linked to the client file
    await this.prisma.outcomeMeasureResponse.create({
      data: {
        clientFileId: clientFile.id,
        responses: [], // Empty responses initially, will be filled when client submits
        totalScore: 0,
        criteria: 'Not Completed',
      },
    });

    // Send notification to client
    try {
      const creatorName = `${clientFile.creator.firstName} ${clientFile.creator.lastName}`;
      const measureTitle = clientFile.outcomeMeasure.title;
      
      await this.notificationService.createNotification({
        receiverId: clientUserId.id,
        content: `${creatorName} has shared an assessment with you: ${measureTitle}`,
        associatedLink: '/files',
      });
    } catch (error) {
      console.error('Error creating notification for outcome measure sharing:', error);
      // Don't fail the outcome measure sharing if notification fails
    }

    return clientFile;
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
        file: {
          select: {
            id: true,
            fileName: true,
            fileUrl: true,
            fileSize: true,
            mimeType: true,
          },
        },
        portalForm: {
          select: {
            id: true,
            title: true,
          },
        },
        outcomeMeasure: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Send notification to assigned clinician when client completes the file
    try {
      const clientName = `${updatedFile.client.firstName} ${updatedFile.client.lastName}`;
      let itemName = '';
      let itemType = '';

      if (updatedFile.file) {
        itemName = updatedFile.file.fileName;
        itemType = 'file';
      } else if (updatedFile.portalForm) {
        itemName = updatedFile.portalForm.title;
        itemType = 'form';
      } else if (updatedFile.outcomeMeasure) {
        itemName = updatedFile.outcomeMeasure.title;
        itemType = 'assessment';
      }

      // Get the assigned clinician for this client
      const assignedClinician = await this.prisma.clientClinician.findFirst({
        where: { clientId: updatedFile.clientId },
        include: {
          clinician: {
            include: {
              user: {
                select: { id: true }
              }
            }
          }
        }
      });

      if (assignedClinician?.clinician?.user) {
        await this.notificationService.createNotification({
          receiverId: assignedClinician.clinician.user.id,
          content: `${clientName} has completed the ${itemType}: ${itemName}`,
          associatedLink: '/files',
        });
      }
    } catch (error) {
      console.error('Error creating notification for file completion:', error);
      // Don't fail the completion if notification fails
    }

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
  async getDownloadUrl(fileId: string, userId: string): Promise<{ downloadUrl: string }> {
    const clientFile = await this.prisma.clientFile.findUnique({
      where: { id: fileId },
      include: {
        file: true,
        client: true,
      },
    });

    if (!clientFile) {
      throw new NotFoundException('File not found');
    }

    // Check if the requesting user has permission to download this file
    const requestingUser = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        client: true,
        staffProfile: true,
      },
    });

    if (!requestingUser) {
      throw new NotFoundException('User not found');
    }

    // Allow download if:
    // 1. The user is the client who owns the file
    // 2. The user is staff
    const isClient = requestingUser.clientId === clientFile.client.clientId;
    const isStaff = requestingUser.staffProfile !== null;

    if (!isClient && !isStaff) {
      throw new ForbiddenException('You can only download your own files');
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
