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
import { SignFileDto } from './dto/sign-file.dto';
import { CompleteFileDto } from './dto/complete-file.dto';
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
   * Create a new file for a client
   */
  @Post()
  async newFile(
    @Param('clientId') clientId: string,
    @Body() createClientFileDto: CreateClientFileDto,
    @Request() req: any,
  ) {
    // Set the clientId and createdBy from the request
    createClientFileDto.clientId = clientId;
    createClientFileDto.createdBy = req.user.id;
    return this.clientFilesService.newFile(createClientFileDto);
  }

  /**
   * Sign a file by the author
   */
  @Put(':fileId/sign')
  @HttpCode(HttpStatus.OK)
  async signByAuthor(
    @Param('fileId') fileId: string,
    @Request() req: any,
  ) {
    const signFileDto: SignFileDto = {
      fileId,
      signedBy: req.user.id,
    };

    return this.clientFilesService.signByAuthor(signFileDto);
  }

  /**
   * Co-sign a file by supervisor
   */
  @Put(':fileId/co-sign')
  @HttpCode(HttpStatus.OK)
  async coSignFile(
    @Param('fileId') fileId: string,
    @Request() req: any,
  ) {
    return this.clientFilesService.coSignFile(fileId, req.user.id);
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
