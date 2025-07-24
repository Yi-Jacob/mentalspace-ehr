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
  async findAll(@Query() queryDto: QueryNotesDto) {
    return this.notesService.findAll(queryDto);
  }

  @Get('pending-approvals')
  @ApiOperation({ summary: 'Get all notes pending approval' })
  @ApiResponse({ status: 200, description: 'Pending approvals retrieved successfully', type: [NoteEntity] })
  async findPendingApprovals(): Promise<NoteEntity[]> {
    return this.notesService.findPendingApprovals();
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

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a note' })
  @ApiResponse({ status: 200, description: 'Note deleted successfully' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.notesService.deleteNote(id);
  }

  @Patch(':id/submit')
  @ApiOperation({ summary: 'Submit note for review' })
  @ApiResponse({ status: 200, description: 'Note submitted for review successfully', type: NoteEntity })
  async submitForReview(@Param('id') id: string): Promise<NoteEntity> {
    return this.notesService.submitForReview(id);
  }

  @Patch(':id/sign')
  @ApiOperation({ summary: 'Sign a note' })
  @ApiResponse({ status: 200, description: 'Note signed successfully', type: NoteEntity })
  async signNote(@Param('id') id: string, @Body() body: { signature: string }, @Request() req): Promise<NoteEntity> {
    return this.notesService.signNote(id, req.user.id);
  }

  @Patch(':id/lock')
  @ApiOperation({ summary: 'Lock a note' })
  @ApiResponse({ status: 200, description: 'Note locked successfully', type: NoteEntity })
  async lockNote(@Param('id') id: string): Promise<NoteEntity> {
    return this.notesService.lockNote(id);
  }
} 