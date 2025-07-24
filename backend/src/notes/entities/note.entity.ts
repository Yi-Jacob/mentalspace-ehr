import { ApiProperty } from '@nestjs/swagger';
import { NoteType, NoteStatus } from '../dto/create-note.dto';

export class NoteEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: Record<string, any>;

  @ApiProperty()
  clientId: string;

  @ApiProperty()
  providerId: string;

  @ApiProperty({ enum: NoteType })
  noteType: NoteType;

  @ApiProperty({ enum: NoteStatus })
  status: NoteStatus;

  @ApiProperty({ required: false })
  signedAt?: Date;

  @ApiProperty({ required: false })
  signedBy?: string;

  @ApiProperty({ required: false })
  approvedAt?: Date;

  @ApiProperty({ required: false })
  approvedBy?: string;

  @ApiProperty({ required: false })
  coSignedAt?: Date;

  @ApiProperty({ required: false })
  coSignedBy?: string;

  @ApiProperty({ required: false })
  lockedAt?: Date;

  @ApiProperty({ required: false })
  version?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
} 