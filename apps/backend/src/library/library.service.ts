import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { S3Service } from '../common/s3.service';

@Injectable()
export class LibraryService {
  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service,
  ) {}

  /**
   * Get all library files
   */
  async getAllFiles(userId: string) {
    // Get user to check access level
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          where: { isActive: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user has admin role
    const isAdmin = user.userRoles.some(role => role.role === 'admin');
    const isClinician = user.userRoles.some(role => role.role === 'clinician');
    const isBilling = user.userRoles.some(role => role.role === 'billing');

    // Build access level filter
    const accessLevels = ['admin'];
    if (isClinician) accessLevels.push('clinician');
    if (isBilling) accessLevels.push('billing');

    const files = await this.prisma.file.findMany({
      where: {
        accessLevel: {
          in: accessLevels,
        },
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
        user: {
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
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return files;
  }

  /**
   * Create a new library file
   */
  async createFile(createFileDto: CreateFileDto, createdBy: string) {

    // Verify client exists if specified
    if (createFileDto.clientId) {
      const client = await this.prisma.client.findUnique({
        where: { id: createFileDto.clientId },
      });

      if (!client) {
        throw new NotFoundException('Client not found');
      }
    }

    // Verify user exists if specified
    if (createFileDto.userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: createFileDto.userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }
    }

    // Create the file
    const file = await this.prisma.file.create({
      data: {
        fileName: createFileDto.fileName,
        fileUrl: createFileDto.fileUrl,
        fileSize: createFileDto.fileSize,
        mimeType: createFileDto.mimeType,
        sharable: createFileDto.sharable,
        accessLevel: createFileDto.accessLevel,
        isForPatient: createFileDto.isForPatient ?? false,
        isForStaff: createFileDto.isForStaff ?? false,
        clientId: createFileDto.clientId,
        userId: createFileDto.userId,
        createdBy: createdBy,
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
        user: {
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
      },
    });

    return file;
  }

  /**
   * Get a single file by ID
   */
  async getFileById(fileId: string, userId: string) {
    const file = await this.prisma.file.findUnique({
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
        user: {
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
      },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    // Check access permissions
    await this.checkFileAccess(file, userId);

    return file;
  }

  /**
   * Get download URL for a file
   */
  async getDownloadUrl(fileId: string, userId: string): Promise<{ downloadUrl: string }> {
    const file = await this.prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    // Check access permissions
    await this.checkFileAccess(file, userId);

    // Extract the S3 key from the file URL
    const url = new URL(file.fileUrl);
    const s3Key = url.pathname.substring(1); // Remove leading slash

    // Generate signed URL for download (expires in 1 hour)
    const downloadUrl = await this.s3Service.getSignedDownloadUrl(s3Key, 3600);

    return { downloadUrl };
  }

  /**
   * Get view URL for a file (opens in browser instead of downloading)
   */
  async getViewUrl(fileId: string, userId: string): Promise<{ viewUrl: string }> {
    const file = await this.prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    // Check access permissions
    await this.checkFileAccess(file, userId);

    // Extract the S3 key from the file URL
    const url = new URL(file.fileUrl);
    const s3Key = url.pathname.substring(1); // Remove leading slash

    // Generate signed URL for viewing (expires in 1 hour)
    const viewUrl = await this.s3Service.getSignedViewUrl(s3Key, 3600);

    return { viewUrl };
  }

  /**
   * Update a file
   */
  async updateFile(fileId: string, updateFileDto: UpdateFileDto, userId: string) {
    const file = await this.prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    // Check if user can update the file (only creator or admin)
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          where: { isActive: true },
        },
      },
    });

    const isAdmin = user?.userRoles.some(role => role.role === 'admin');
    const isCreator = file.createdBy === userId;

    if (!isAdmin && !isCreator) {
      throw new ForbiddenException('Only the file creator or admin can update this file');
    }

    // Verify client exists if specified
    if (updateFileDto.clientId) {
      const client = await this.prisma.client.findUnique({
        where: { id: updateFileDto.clientId },
      });

      if (!client) {
        throw new NotFoundException('Client not found');
      }
    }

    // Verify user exists if specified
    if (updateFileDto.userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: updateFileDto.userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }
    }


    const updatedFile = await this.prisma.file.update({
      where: { id: fileId },
      data: {
        fileName: updateFileDto.fileName,
        sharable: updateFileDto.sharable,
        accessLevel: updateFileDto.accessLevel,
        isForPatient: updateFileDto.isForPatient ?? false,
        isForStaff: updateFileDto.isForStaff ?? false,
        clientId: updateFileDto.clientId,
        userId: updateFileDto.userId,
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
        user: {
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
      },
    });

    return updatedFile;
  }

  /**
   * Delete a file
   */
  async deleteFile(fileId: string, userId: string) {
    const file = await this.prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    // Check if user can delete the file (only creator or admin)
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          where: { isActive: true },
        },
      },
    });

    const isAdmin = user?.userRoles.some(role => role.role === 'admin');
    const isCreator = file.createdBy === userId;

    if (!isAdmin && !isCreator) {
      throw new ForbiddenException('Only the file creator or admin can delete this file');
    }

    await this.prisma.file.delete({
      where: { id: fileId },
    });

    return { message: 'File deleted successfully' };
  }

  /**
   * Check if user has access to a file
   */
  private async checkFileAccess(file: any, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          where: { isActive: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isAdmin = user.userRoles.some(role => role.role === 'Practice Administrator');
    const isClinician = user.userRoles.some(role => role.role === 'Clinician' || role.role === 'Intern' || role.role === 'Assistant' || role.role === 'Associate');
    const isBilling = user.userRoles.some(role => role.role === 'Biller for Assigned Patients Only' || role.role === 'Practice Biller');

    // Check access level - admin can access all files
    if (isAdmin) {
      return; // Admin has access to all files
    }

    // Check specific access levels
    const hasAccess = 
      (file.accessLevel === 'clinician' && isClinician) ||
      (file.accessLevel === 'billing' && isBilling) ||
      (file.accessLevel === 'admin' && (isAdmin || isClinician || isBilling)); // Allow staff roles to access admin files

    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this file');
    }
  }
}
