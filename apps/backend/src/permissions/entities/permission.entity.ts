import { ApiProperty } from '@nestjs/swagger';

export class PermissionEntity {
  @ApiProperty()
  category: string;

  @ApiProperty()
  action: string;

  @ApiProperty()
  scope: string;
} 