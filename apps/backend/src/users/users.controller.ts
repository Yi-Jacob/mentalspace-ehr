import { Controller, Get, Post, Param, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Post(':id/set-default-password')
  @ApiOperation({ summary: 'Set default password for a user' })
  @ApiResponse({ status: 200, description: 'Default password set successfully' })
  setDefaultPassword(@Param('id') id: string) {
    return this.usersService.setDefaultPassword(id);
  }

  @Post(':id/activate')
  @ApiOperation({ summary: 'Activate a user' })
  @ApiResponse({ status: 200, description: 'User activated successfully' })
  activateUser(@Param('id') id: string) {
    return this.usersService.activateUser(id);
  }

  @Post(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a user' })
  @ApiResponse({ status: 200, description: 'User deactivated successfully' })
  deactivateUser(@Param('id') id: string) {
    return this.usersService.deactivateUser(id);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile with relationships' })
  @ApiResponse({ status: 200, description: 'User profile with supervisor/supervisee and client relationships' })
  getMyProfile(@GetUser() user: any) {
    return this.usersService.getMyProfile(user.id);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'User profile updated successfully' })
  updateMyProfile(@GetUser() user: any, @Body() updateData: any) {
    return this.usersService.updateMyProfile(user.id, updateData);
  }

  @Put('password')
  @ApiOperation({ summary: 'Update current user password' })
  @ApiResponse({ status: 200, description: 'Password updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid current password or password mismatch' })
  updatePassword(@GetUser() user: any, @Body() passwordData: any) {
    return this.usersService.updatePassword(user.id, passwordData);
  } 

}