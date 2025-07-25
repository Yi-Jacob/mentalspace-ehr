import { ApiProperty } from '@nestjs/swagger';

export class QuickActionEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  actionType: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  priority: number;

  @ApiProperty({ required: false })
  dueDate?: Date;

  @ApiProperty()
  completed: boolean;

  @ApiProperty({ required: false })
  completedAt?: Date;

  @ApiProperty()
  createdAt: Date;
} 