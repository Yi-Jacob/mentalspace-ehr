import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsService } from './permissions.service';
import { PermissionEntity } from './entities/permission.entity';

@ApiTags('permissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get('user')
  @ApiOperation({ summary: 'Get current user permissions' })
  @ApiResponse({ status: 200, description: 'User permissions retrieved successfully', type: [PermissionEntity] })
  async getUserPermissions(@Request() req): Promise<PermissionEntity[]> {
    return this.permissionsService.getUserPermissions(req.user.id);
  }

  @Get('patient/:clientId/access')
  @ApiOperation({ summary: 'Check if user can access a specific patient' })
  @ApiResponse({ status: 200, description: 'Access check completed successfully' })
  async canAccessPatient(
    @Param('clientId') clientId: string,
    @Query('accessType') accessType: string = 'read',
    @Request() req
  ): Promise<{ canAccess: boolean }> {
    const canAccess = await this.permissionsService.canAccessPatient(req.user.id, clientId, accessType);
    return { canAccess };
  }
} 