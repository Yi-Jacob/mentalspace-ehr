import { ApiProperty } from '@nestjs/swagger';

export class PracticeSettingsEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ required: false })
  practiceName?: string;

  @ApiProperty({ required: false })
  practiceAddress?: Record<string, any>;

  @ApiProperty({ required: false })
  practiceContact?: Record<string, any>;

  @ApiProperty({ required: false })
  businessHours?: Record<string, any>;

  @ApiProperty({ required: false })
  securitySettings?: Record<string, any>;

  @ApiProperty({ required: false })
  portalSettings?: Record<string, any>;

  @ApiProperty({ required: false })
  schedulingSettings?: Record<string, any>;

  @ApiProperty({ required: false })
  documentationSettings?: Record<string, any>;

  @ApiProperty({ required: false })
  billingSettings?: Record<string, any>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
} 