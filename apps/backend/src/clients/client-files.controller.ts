import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ClientFilesService } from './client-files.service';
import { CreateClientFileDto } from './dto/create-client-file.dto';
import { UpdateClientFileDto } from './dto/update-client-file.dto';
import { CompleteFileDto } from './dto/complete-file.dto';
import { ShareFileDto } from './dto/share-file.dto';
import { SharePortalFormDto } from './dto/share-portal-form.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('clients/:clientId/files')
@UseGuards(JwtAuthGuard)
export class ClientFilesController {
  constructor(private readonly clientFilesService: ClientFilesService) {}

  /**
   * Get all files for a specific client
   */
  @Get()
  async getForClient(
    @Param('clientId') clientId: string,
    @Request() req: any,
  ) {
    return this.clientFilesService.getForClient(clientId, req.user.id);
  }

  /**
   * Get shareable files (not for patient and not for staff)
   */
  @Get('shareable')
  async getShareableFiles() {
    return this.clientFilesService.getShareableFiles();
  }

  /**
   * Get shareable portal forms
   */
  @Get('shareable-portal-forms')
  async getShareablePortalForms() {
    return this.clientFilesService.getShareablePortalForms();
  }

  /**
   * Share a file with a client
   */
  @Post()
  async shareFile(
    @Param('clientId') clientId: string,
    @Body() shareFileDto: ShareFileDto,
    @Request() req: any,
  ) {
    const createClientFileDto: CreateClientFileDto = {
      clientId,
      fileId: shareFileDto.fileId,
      notes: shareFileDto.notes,
      createdBy: req.user.id,
    };
    return this.clientFilesService.shareFile(createClientFileDto);
  }

  /**
   * Share a portal form with a client
   */
  @Post('share-portal-form')
  async sharePortalForm(
    @Param('clientId') clientId: string,
    @Body() sharePortalFormDto: SharePortalFormDto,
  ) {
    return this.clientFilesService.sharePortalForm(clientId, sharePortalFormDto);
  }

  /**
   * Complete a file by the client
   */
  @Put(':fileId/complete')
  @HttpCode(HttpStatus.OK)
  async completeByClient(
    @Param('fileId') fileId: string,
    @Request() req: any,
  ) {
    const completeFileDto: CompleteFileDto = {
      fileId,
      completedBy: req.user.id,
    };

    return this.clientFilesService.completeByClient(completeFileDto);
  }

  /**
   * Get a single file by ID
   */
  @Get(':fileId')
  async getFileById(
    @Param('fileId') fileId: string,
    @Request() req: any,
  ) {
    return this.clientFilesService.getFileById(fileId);
  }

  /**
   * Get download URL for a file
   */
  @Get(':fileId/download')
  async getDownloadUrl(
    @Param('fileId') fileId: string,
    @Request() req: any,
  ) {
    return this.clientFilesService.getDownloadUrl(fileId, req.user.id);
  }

  /**
   * Update a file
   */
  @Put(':fileId')
  async updateFile(
    @Param('fileId') fileId: string,
    @Body() updateClientFileDto: UpdateClientFileDto,
    @Request() req: any,
  ) {
    // This would require additional implementation in the service
    // For now, we'll focus on the core functionality
    throw new Error('Update functionality not implemented yet');
  }

  /**
   * Delete a file
   */
  @Delete(':fileId')
  @HttpCode(HttpStatus.OK)
  async deleteFile(
    @Param('fileId') fileId: string,
    @Request() req: any,
  ) {
    return this.clientFilesService.deleteFile(fileId, req.user.id);
  }
}
