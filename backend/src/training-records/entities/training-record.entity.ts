import { ApiProperty } from '@nestjs/swagger';

export class TrainingRecordEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  trainingTitle: string;

  @ApiProperty()
  trainingType: string;

  @ApiProperty({ required: false })
  providerOrganization?: string;

  @ApiProperty({ required: false })
  completionDate?: Date;

  @ApiProperty({ required: false })
  expiryDate?: Date;

  @ApiProperty({ required: false })
  hoursCompleted?: number;

  @ApiProperty({ required: false })
  certificateNumber?: string;

  @ApiProperty()
  status: string;

  @ApiProperty({ required: false })
  notes?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ required: false })
  user?: {
    firstName: string;
    lastName: string;
  };
} 