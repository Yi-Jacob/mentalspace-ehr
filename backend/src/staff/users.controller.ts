import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/enums/user-role.enum';

@ApiTags('Staff')
@Controller('staff')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiResponse({ status: 200, description: 'User found' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  // User Roles endpoints
  @Get('roles/current')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  @ApiOperation({ summary: 'Get current user roles' })
  @ApiResponse({ status: 200, description: 'Current user roles retrieved' })
  getCurrentUserRoles(@Request() req) {
    return this.usersService.getCurrentUserRoles(req.user.id);
  }

  @Post('roles/assign')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Assign role to user' })
  @ApiResponse({ status: 201, description: 'Role assigned successfully' })
  assignRole(@Body() body: { userId: string; role: string }, @Request() req) {
    return this.usersService.assignRole(body.userId, body.role, req.user.id);
  }

  @Post('roles/remove')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Remove role from user' })
  @ApiResponse({ status: 200, description: 'Role removed successfully' })
  removeRole(@Body() body: { userId: string; role: string }) {
    return this.usersService.removeRole(body.userId, body.role);
  }

  // Performance Metrics endpoints
  @Get('performance-metrics')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  @ApiOperation({ summary: 'Get performance metrics' })
  @ApiResponse({ status: 200, description: 'Performance metrics retrieved' })
  getPerformanceMetrics(@Query('userId') userId?: string) {
    return this.usersService.getPerformanceMetrics(userId);
  }

  @Post('performance-metrics')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER)
  @ApiOperation({ summary: 'Create performance metric' })
  @ApiResponse({ status: 201, description: 'Performance metric created' })
  createPerformanceMetric(@Body() metric: any, @Request() req) {
    return this.usersService.createPerformanceMetric(metric, req.user.id);
  }

  @Put('performance-metrics/:id')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER)
  @ApiOperation({ summary: 'Update performance metric' })
  @ApiResponse({ status: 200, description: 'Performance metric updated' })
  updatePerformanceMetric(@Param('id') id: string, @Body() updates: any) {
    return this.usersService.updatePerformanceMetric(id, updates);
  }
} 