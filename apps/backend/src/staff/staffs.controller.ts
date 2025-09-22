import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StaffsService } from './staffs.service';
import { CreateUserDto, UserRole } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Staff')
@Controller('staff')
// @UseGuards(JwtAuthGuard)
export class StaffsController {
  constructor(private readonly staffsService: StaffsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.staffsService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all users' })
  findAll() {
    return this.staffsService.findAll();
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users with their types (staff/clients)' })
  @ApiResponse({ status: 200, description: 'List of all users with types' })
  getAllUsersWithTypes() {
    return this.staffsService.getAllUsersWithTypes();
  }

  @Get('profiles')
  @ApiOperation({ summary: 'Get all staff profiles for provider selection' })
  @ApiResponse({ status: 200, description: 'List of all staff profiles' })
  getAllStaffProfiles() {
    return this.staffsService.getAllStaffProfiles();
  }

  @Get('profiles/available')
  @ApiOperation({ summary: 'Get all available staff profiles for clinician assignment' })
  @ApiResponse({ status: 200, description: 'List of all available staff profiles' })
  getAvailableStaffProfiles() {
    return this.staffsService.getAvailableStaffProfiles();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiResponse({ status: 200, description: 'User found' })
  findOne(@Param('id') id: string) {
    return this.staffsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.staffsService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  remove(@Param('id') id: string) {
    return this.staffsService.remove(id);
  }

  @Get('roles/available')
  @ApiOperation({ summary: 'Get all available roles' })
  @ApiResponse({ status: 200, description: 'Available roles retrieved' })
  getAvailableRoles() {
    return Object.values(UserRole);
  }

  @Post('roles/assign')
  @ApiOperation({ summary: 'Assign a role to a user' })
  @ApiResponse({ status: 200, description: 'Role assigned successfully' })
  assignRole(@Body() body: { userId: string; role: string }) {
    return this.staffsService.assignRole(body.userId, body.role);
  }

  @Post('roles/remove')
  @ApiOperation({ summary: 'Remove a role from a user' })
  @ApiResponse({ status: 200, description: 'Role removed successfully' })
  removeRole(@Body() body: { userId: string; role: string }) {
    return this.staffsService.removeRole(body.userId, body.role);
  }

  @Post(':id/set-random-password')
  @ApiOperation({ summary: 'Set random secure password for a user' })
  @ApiResponse({ status: 200, description: 'Random secure password set successfully' })
  setDefaultPassword(@Param('id') id: string) {
    return this.staffsService.setDefaultPassword(id);
  }

  @Post(':id/activate')
  @ApiOperation({ summary: 'Activate a user' })
  @ApiResponse({ status: 200, description: 'User activated successfully' })
  activateUser(@Param('id') id: string) {
    return this.staffsService.activateUser(id);
  }

  @Post(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a user' })
  @ApiResponse({ status: 200, description: 'User deactivated successfully' })
  deactivateUser(@Param('id') id: string) {
    return this.staffsService.deactivateUser(id);
  }

  // Performance Metrics endpoints
  @Get('performance-metrics')
  @ApiOperation({ summary: 'Get performance metrics' })
  @ApiResponse({ status: 200, description: 'Performance metrics retrieved' })
  getPerformanceMetrics(@Query('userId') userId?: string) {
    return this.staffsService.getPerformanceMetrics(userId);
  }

  @Post('performance-metrics')
  @ApiOperation({ summary: 'Create performance metric' })
  @ApiResponse({ status: 201, description: 'Performance metric created' })
  createPerformanceMetric(@Body() metric: any, @Request() req) {
    return this.staffsService.createPerformanceMetric(metric, req.user.id);
  }

  @Put('performance-metrics/:id')
  @ApiOperation({ summary: 'Update performance metric' })
  @ApiResponse({ status: 200, description: 'Performance metric updated' })
  updatePerformanceMetric(@Param('id') id: string, @Body() updates: any) {
    return this.staffsService.updatePerformanceMetric(id, updates);
  }
} 