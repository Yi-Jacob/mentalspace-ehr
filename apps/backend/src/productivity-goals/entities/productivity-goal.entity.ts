import { ApiProperty } from '@nestjs/swagger';

export class ProductivityGoalEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  goalType: string;

  @ApiProperty()
  targetValue: number;

  @ApiProperty({ required: false })
  currentValue?: number;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
} 