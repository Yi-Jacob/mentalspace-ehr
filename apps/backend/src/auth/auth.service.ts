import { Injectable, UnauthorizedException, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { BCRYPT_SALT_ROUNDS } from '../common/constants';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private async getAuthSettings() {
    try {
      const practiceSettings = await this.prisma.practiceSetting.findFirst();
      if (!practiceSettings) {
        return {
          jwtExpiresIn: '24h',
          passwordResetExpirationMinutes: 60,
        };
      }
      
      const authSettings = practiceSettings.authSettings as any;
      return {
        jwtExpiresIn: authSettings?.jwtExpiresIn || '24h',
        passwordResetExpirationMinutes: authSettings?.passwordResetExpirationMinutes || 60,
      };
    } catch (error) {
      // Fallback to defaults if practice settings fail to load
      return {
        jwtExpiresIn: '24h',
        passwordResetExpirationMinutes: 60,
      };
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
      include: {
        userRoles: {
          where: { isActive: true },
          select: { role: true }
        }
      }
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Extract roles from userRoles
    const roles = user.userRoles.map(userRole => userRole.role);
    
    const payload = { 
      email: user.email, 
      sub: user.id,
      roles: roles
    };

    // Get auth settings for JWT expiration
    const authSettings = await this.getAuthSettings();

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: authSettings.jwtExpiresIn }),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive,
        roles: roles,
        clientId: user.clientId,
        staffId: user.staffId,
      },
    };
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: {
          userRoles: {
            where: { isActive: true },
            select: { role: true }
          }
        }
      });

      if (!user || !user.isActive) {
        return null;
      }

      // Extract roles from userRoles
      const roles = user.userRoles.map(userRole => userRole.role);

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive,
        roles: roles,
        clientId: user.clientId,
        staffId: user.staffId,
      };
    } catch (error) {
      return null;
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    // Validate that passwords match
    if (resetPasswordDto.password !== resetPasswordDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Find the reset token
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token: resetPasswordDto.token },
      include: { user: true },
    });

    if (!resetToken) {
      throw new NotFoundException('Invalid reset token');
    }

    // Check if token is expired
    if (resetToken.expiresAt < new Date()) {
      throw new BadRequestException('Reset token has expired');
    }

    // Check if token has already been used
    if (resetToken.usedAt) {
      throw new BadRequestException('Reset token has already been used');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(resetPasswordDto.password, BCRYPT_SALT_ROUNDS);

    // Update user password and mark token as used
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return {
      message: 'Password has been reset successfully',
    };
  }

  async createPasswordResetToken(userId: string) {
    // Generate a secure random token
    const token = randomBytes(32).toString('hex');
    
    // Get expiration time from practice settings
    const authSettings = await this.getAuthSettings();
    const expirationMinutes = authSettings.passwordResetExpirationMinutes;
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + expirationMinutes);

    // Create password reset token
    const resetToken = await this.prisma.passwordResetToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });

    // Generate reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    
    return {
      resetUrl,
      token, // Remove this in production
      expiresAt: resetToken.expiresAt,
    };
  }

  async logout(token?: string) {
    
      return {
        message: 'Logged out successfully',
        timestamp: new Date().toISOString(),
      }
  }
} 