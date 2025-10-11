import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AuditLogService } from '../audit/audit-log.service';

@Injectable()
export class AccountLockoutService {
  private readonly logger = new Logger(AccountLockoutService.name);
  
  // HIPAA-compliant lockout settings
  private readonly MAX_FAILED_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION_MINUTES = 30;
  private readonly RESET_ATTEMPTS_AFTER_HOURS = 24;

  constructor(
    private prisma: PrismaService,
    private auditLogService: AuditLogService,
  ) {}

  /**
   * Check if account is currently locked
   */
  async isAccountLocked(userId: string): Promise<{ isLocked: boolean; lockedUntil?: Date; remainingMinutes?: number }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { 
        accountLockedUntil: true,
        failedLoginAttempts: true,
        lastFailedLogin: true
      }
    });

    if (!user) {
      return { isLocked: false };
    }

    // Check if lockout period has expired
    if (user.accountLockedUntil && user.accountLockedUntil > new Date()) {
      const remainingMs = user.accountLockedUntil.getTime() - Date.now();
      const remainingMinutes = Math.ceil(remainingMs / (1000 * 60));
      
      return {
        isLocked: true,
        lockedUntil: user.accountLockedUntil,
        remainingMinutes
      };
    }

    // Check if we should reset attempts after 24 hours
    if (user.lastFailedLogin) {
      const hoursSinceLastFailure = (Date.now() - user.lastFailedLogin.getTime()) / (1000 * 60 * 60);
      if (hoursSinceLastFailure >= this.RESET_ATTEMPTS_AFTER_HOURS && user.failedLoginAttempts > 0) {
        await this.resetFailedAttempts(userId);
        return { isLocked: false };
      }
    }

    return { isLocked: false };
  }

  /**
   * Record a failed login attempt
   */
  async recordFailedAttempt(userId: string, userEmail: string, ipAddress?: string, userAgent?: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { failedLoginAttempts: true }
    });

    if (!user) {
      return;
    }

    const newAttemptCount = user.failedLoginAttempts + 1;
    const now = new Date();
    
    // Calculate lockout time if this is the max attempt
    const lockoutUntil = newAttemptCount >= this.MAX_FAILED_ATTEMPTS 
      ? new Date(now.getTime() + (this.LOCKOUT_DURATION_MINUTES * 60 * 1000))
      : null;

    // Update user record
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: newAttemptCount,
        lastFailedLogin: now,
        accountLockedUntil: lockoutUntil,
        updatedAt: now
      }
    });

    // Log the failed attempt
    await this.auditLogService.log({
      userId,
      userEmail,
      action: 'LOGIN',
      resource: 'User',
      resourceId: userId,
      description: `Failed login attempt ${newAttemptCount}/${this.MAX_FAILED_ATTEMPTS}`,
      ipAddress,
      userAgent,
      newValues: {
        failedAttempts: newAttemptCount,
        isLocked: lockoutUntil !== null,
        lockedUntil: lockoutUntil
      }
    });

    this.logger.warn(`Failed login attempt for user ${userEmail}: ${newAttemptCount}/${this.MAX_FAILED_ATTEMPTS}`);
    
    if (lockoutUntil) {
      this.logger.error(`Account locked for user ${userEmail} until ${lockoutUntil.toISOString()}`);
    }
  }

  /**
   * Reset failed attempts on successful login
   */
  async resetFailedAttempts(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: 0,
        accountLockedUntil: null,
        lastFailedLogin: null,
        updatedAt: new Date()
      }
    });

    this.logger.log(`Reset failed login attempts for user ${userId}`);
  }

  /**
   * Manually unlock an account (admin function)
   */
  async unlockAccount(userId: string, adminUserId: string, adminEmail: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, accountLockedUntil: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: 0,
        accountLockedUntil: null,
        lastFailedLogin: null,
        updatedAt: new Date()
      }
    });

    // Log the manual unlock
    await this.auditLogService.log({
      userId: adminUserId,
      userEmail: adminEmail,
      action: 'UPDATE',
      resource: 'User',
      resourceId: userId,
      description: `Manually unlocked account for user ${user.email}`,
      newValues: {
        action: 'account_unlocked',
        targetUser: user.email,
        previousLockStatus: user.accountLockedUntil ? 'locked' : 'unlocked'
      }
    });

    this.logger.log(`Account manually unlocked for user ${user.email} by admin ${adminEmail}`);
  }

  /**
   * Get lockout statistics for monitoring
   */
  async getLockoutStats(): Promise<{
    totalLockedAccounts: number;
    totalFailedAttempts: number;
    recentLockouts: Array<{
      userId: string;
      email: string;
      lockedUntil: Date;
      failedAttempts: number;
    }>;
  }> {
    const now = new Date();
    
    const lockedUsers = await this.prisma.user.findMany({
      where: {
        accountLockedUntil: {
          gt: now
        }
      },
      select: {
        id: true,
        email: true,
        accountLockedUntil: true,
        failedLoginAttempts: true
      }
    });

    const totalFailedAttempts = await this.prisma.user.aggregate({
      _sum: {
        failedLoginAttempts: true
      }
    });

    return {
      totalLockedAccounts: lockedUsers.length,
      totalFailedAttempts: totalFailedAttempts._sum.failedLoginAttempts || 0,
      recentLockouts: lockedUsers.map(user => ({
        userId: user.id,
        email: user.email,
        lockedUntil: user.accountLockedUntil!,
        failedAttempts: user.failedLoginAttempts
      }))
    };
  }

  /**
   * Clean up expired lockouts (scheduled job)
   */
  async cleanupExpiredLockouts(): Promise<number> {
    const now = new Date();
    
    const result = await this.prisma.user.updateMany({
      where: {
        accountLockedUntil: {
          lt: now
        },
        failedLoginAttempts: {
          gt: 0
        }
      },
      data: {
        failedLoginAttempts: 0,
        accountLockedUntil: null,
        lastFailedLogin: null,
        updatedAt: now
      }
    });

    if (result.count > 0) {
      this.logger.log(`Cleaned up ${result.count} expired account lockouts`);
    }

    return result.count;
  }
}
