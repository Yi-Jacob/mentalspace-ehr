import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { NoteHistoryService } from './note-history.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [NotesController],
  providers: [NotesService, NoteHistoryService],
  exports: [NotesService, NoteHistoryService],
})
export class NotesModule {} 