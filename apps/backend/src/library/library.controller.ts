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
import { LibraryService } from './library.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('library')
@UseGuards(JwtAuthGuard)
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  /**
   * Get all library files
   */
  @Get()
  async getAllFiles(@Request() req: any) {
    return this.libraryService.getAllFiles(req.user.id);
  }

  /**
   * Create a new library file
   */
  @Post()
  async createFile(
    @Body() createFileDto: CreateFileDto,
    @Request() req: any,
  ) {
    return this.libraryService.createFile(createFileDto, req.user.id);
  }

  /**
   * Get a single file by ID
   */
  @Get(':fileId')
  async getFileById(
    @Param('fileId') fileId: string,
    @Request() req: any,
  ) {
    return this.libraryService.getFileById(fileId, req.user.id);
  }

  /**
   * Get download URL for a file
   */
  @Get(':fileId/download')
  async getDownloadUrl(
    @Param('fileId') fileId: string,
    @Request() req: any,
  ) {
    return this.libraryService.getDownloadUrl(fileId, req.user.id);
  }

  /**
   * Update a file
   */
  @Put(':fileId')
  async updateFile(
    @Param('fileId') fileId: string,
    @Body() updateFileDto: UpdateFileDto,
    @Request() req: any,
  ) {
    return this.libraryService.updateFile(fileId, updateFileDto, req.user.id);
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
    return this.libraryService.deleteFile(fileId, req.user.id);
  }
}
