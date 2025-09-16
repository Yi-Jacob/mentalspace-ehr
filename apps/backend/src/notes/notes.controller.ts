import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotesService } from './notes.service';
import { CreateNoteDto, UpdateNoteDto, QueryNotesDto } from './dto';
import { NoteEntity } from './entities/note.entity';

// Interface for the authenticated user from JWT
interface AuthenticatedUser {
  id: string;
  email: string;
  roles: string[];
}

@ApiTags('notes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new note' })
  @ApiResponse({ status: 201, description: 'Note created successfully', type: NoteEntity })
  async create(@Body() createNoteDto: CreateNoteDto, @Request() req): Promise<NoteEntity> {
    return this.notesService.createNote(createNoteDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notes with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Notes retrieved successfully' })
  async findAll(@Query() queryDto: QueryNotesDto, @Request() req: { user: AuthenticatedUser }) {
    return this.notesService.findAll(queryDto, req.user.id, req.user.roles);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a note by ID' })
  @ApiResponse({ status: 200, description: 'Note retrieved successfully', type: NoteEntity })
  async findOne(@Param('id') id: string): Promise<NoteEntity> {
    return this.notesService.findOne(id);
  }

  @Get('client/:clientId')
  @ApiOperation({ summary: 'Get notes by client ID' })
  @ApiResponse({ status: 200, description: 'Client notes retrieved successfully' })
  async findByClient(@Param('clientId') clientId: string, @Query() queryDto: QueryNotesDto) {
    return this.notesService.findByClient(clientId, queryDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a note' })
  @ApiResponse({ status: 200, description: 'Note updated successfully', type: NoteEntity })
  async update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto): Promise<NoteEntity> {
    return this.notesService.updateNote(id, updateNoteDto);
  }

  @Patch(':id/save-draft')
  @ApiOperation({ summary: 'Save note as draft' })
  @ApiResponse({ status: 200, description: 'Note saved as draft successfully', type: NoteEntity })
  async saveDraft(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto, @Request() req): Promise<NoteEntity> {
    return this.notesService.saveDraft(id, updateNoteDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a note' })
  @ApiResponse({ status: 200, description: 'Note deleted successfully' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.notesService.deleteNote(id);
  }


  @Patch(':id/sign')
  @ApiOperation({ summary: 'Sign a note' })
  @ApiResponse({ status: 200, description: 'Note signed successfully', type: NoteEntity })
  async signNote(@Param('id') id: string, @Request() req): Promise<NoteEntity> {
    // Use the authenticated user's ID from the JWT token
    return this.notesService.signNote(id, req.user.id);
  }

  @Patch(':id/co-sign')
  @ApiOperation({ summary: 'Request co-signature for a note' })
  @ApiResponse({ status: 200, description: 'Note marked for co-signature successfully', type: NoteEntity })
  async coSign(@Param('id') id: string, @Request() req): Promise<NoteEntity> {
    // Use the authenticated user's ID from the JWT token
    return this.notesService.coSign(id, req.user.id);
  }

  @Patch(':id/lock')
  @ApiOperation({ summary: 'Lock a note' })
  @ApiResponse({ status: 200, description: 'Note locked successfully', type: NoteEntity })
  async lockNote(@Param('id') id: string): Promise<NoteEntity> {
    return this.notesService.lockNote(id);
  }

  @Patch(':id/unlock')
  @ApiOperation({ summary: 'Unlock a note' })
  @ApiResponse({ status: 200, description: 'Note unlocked successfully', type: NoteEntity })
  async unlockNote(@Param('id') id: string): Promise<NoteEntity> {
    return this.notesService.unlockNote(id);
  }

  @Get(':id/history')
  @ApiOperation({ summary: 'Get note history' })
  @ApiResponse({ status: 200, description: 'Note history retrieved successfully' })
  async getNoteHistory(@Param('id') id: string) {
    return this.notesService.getNoteHistory(id);
  }

  @Get(':id/history/:versionId')
  @ApiOperation({ summary: 'Get specific note history version' })
  @ApiResponse({ status: 200, description: 'Note history version retrieved successfully' })
  async getNoteHistoryVersion(@Param('id') id: string, @Param('versionId') versionId: string) {
    return this.notesService.getNoteHistoryVersion(id, versionId);
  }
} 