import { ApiProperty } from '@nestjs/swagger';
import { NoteType, NoteStatus } from '../dto/create-note.dto';

export class ClientInfo {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ required: false })
  dateOfBirth?: Date;

  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty({ required: false })
  address1?: string;

  @ApiProperty({ required: false })
  address2?: string;

  @ApiProperty({ required: false })
  city?: string;

  @ApiProperty({ required: false })
  state?: string;

  @ApiProperty({ required: false })
  zipCode?: string;

  @ApiProperty({ required: false })
  genderIdentity?: string;
}

export class ProviderInfo {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;
}

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

  @ApiProperty({ type: ClientInfo, required: false })
  client?: ClientInfo;

  @ApiProperty({ type: ProviderInfo, required: false })
  provider?: ProviderInfo;
} 