import { Controller, Post, Body, Param, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AccountLockoutService } from './account-lockout.service';
import { PrismaService } from '../database/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

@ApiTags('Account Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin/accounts')
export class AccountManagementController {
  constructor(
    private readonly accountLockoutService: AccountLockoutService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('lockout-stats')
  @ApiOperation({ summary: 'Get account lockout statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Lockout statistics retrieved successfully' })
  async getLockoutStats(@Request() req) {
    // Check if user is admin
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        userRoles: {
          where: { isActive: true },
          select: { role: true }
        }
      }
    });

    const isAdmin = user?.userRoles.some(role => role.role === 'Practice Administrator');
    if (!isAdmin) {
      throw new ForbiddenException('Admin access required');
    }

    return this.accountLockoutService.getLockoutStats();
  }

  @Post('unlock/:userId')
  @ApiOperation({ summary: 'Manually unlock a user account (Admin only)' })
  @ApiResponse({ status: 200, description: 'Account unlocked successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async unlockAccount(@Param('userId') userId: string, @Request() req) {
    // Check if user is admin
    const adminUser = await this.prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        userRoles: {
          where: { isActive: true },
          select: { role: true }
        }
      }
    });

    const isAdmin = adminUser?.userRoles.some(role => role.role === 'Practice Administrator');
    if (!isAdmin) {
      throw new ForbiddenException('Admin access required');
    }

    // Check if target user exists
    const targetUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true }
    });

    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    await this.accountLockoutService.unlockAccount(userId, req.user.id, adminUser.email);

    return {
      message: 'Account unlocked successfully',
      userId: targetUser.id,
      email: targetUser.email
    };
  }

  @Get('user/:userId/status')
  @ApiOperation({ summary: 'Get user account status (Admin only)' })
  @ApiResponse({ status: 200, description: 'User status retrieved successfully' })
  async getUserStatus(@Param('userId') userId: string, @Request() req) {
    // Check if user is admin
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        userRoles: {
          where: { isActive: true },
          select: { role: true }
        }
      }
    });

    const isAdmin = user?.userRoles.some(role => role.role === 'Practice Administrator');
    if (!isAdmin) {
      throw new ForbiddenException('Admin access required');
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        isActive: true,
        failedLoginAttempts: true,
        accountLockedUntil: true,
        lastFailedLogin: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    const lockoutStatus = await this.accountLockoutService.isAccountLocked(userId);

    return {
      ...targetUser,
      isLocked: lockoutStatus.isLocked,
      lockedUntil: lockoutStatus.lockedUntil,
      remainingMinutes: lockoutStatus.remainingMinutes
    };
  }

  @Post('cleanup-expired-lockouts')
  @ApiOperation({ summary: 'Clean up expired account lockouts (Admin only)' })
  @ApiResponse({ status: 200, description: 'Expired lockouts cleaned up successfully' })
  async cleanupExpiredLockouts(@Request() req) {
    // Check if user is admin
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        userRoles: {
          where: { isActive: true },
          select: { role: true }
        }
      }
    });

    const isAdmin = user?.userRoles.some(role => role.role === 'Practice Administrator');
    if (!isAdmin) {
      throw new ForbiddenException('Admin access required');
    }

    const cleanedCount = await this.accountLockoutService.cleanupExpiredLockouts();

    return {
      message: 'Expired lockouts cleaned up successfully',
      cleanedCount
    };
  }
}
