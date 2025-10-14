import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { randomBytes } from 'crypto';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenPayload {
  userId: string;
  email: string;
  tokenId: string;
  type: 'refresh';
}

@Injectable()
export class JwtSecurityService {
  private readonly ACCESS_TOKEN_EXPIRES_IN = '15m'; // 15 minutes
  private readonly REFRESH_TOKEN_LENGTH = 32;

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  /**
   * Get refresh token expiration from environment variable
   * Supports formats: '7d' (days), '24h' (hours), '60m' (minutes), '3600s' (seconds)
   * Default: '7d' if not specified
   */
  private get refreshTokenExpiresIn(): string {
    return this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d');
  }

  /**
   * Generate secure token pair (access + refresh)
   */
  async generateTokenPair(userId: string, email: string, roles: string[]): Promise<TokenPair> {
    // Generate unique refresh token ID
    const refreshTokenId = randomBytes(this.REFRESH_TOKEN_LENGTH).toString('hex');
    
    // Create access token (short-lived)
    const accessTokenPayload = {
      sub: userId,
      email,
      roles,
      type: 'access',
      iat: Math.floor(Date.now() / 1000),
    };

    // Create refresh token (longer-lived)
    const refreshTokenPayload: RefreshTokenPayload = {
      userId,
      email,
      tokenId: refreshTokenId,
      type: 'refresh',
    };

    const accessToken = this.jwtService.sign(accessTokenPayload, {
      expiresIn: this.ACCESS_TOKEN_EXPIRES_IN,
    });

    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      expiresIn: this.refreshTokenExpiresIn,
    });

    // Store refresh token in database for revocation capability
    await this.storeRefreshToken(userId, refreshTokenId, refreshToken);

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15 minutes in seconds
    };
  }

  /**
   * Validate and refresh access token
   */
  async refreshAccessToken(refreshToken: string): Promise<TokenPair> {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken) as RefreshTokenPayload;
      
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      // Check if refresh token exists in database
      const storedToken = await this.prisma.refreshToken.findUnique({
        where: { tokenId: payload.tokenId },
        include: { user: true }
      });

      if (!storedToken || !storedToken.isActive) {
        throw new UnauthorizedException('Refresh token has been revoked');
      }

      // Check if token has expired
      if (storedToken.expiresAt < new Date()) {
        await this.revokeRefreshToken(payload.tokenId);
        throw new UnauthorizedException('Refresh token has expired');
      }

      // Get user roles
      const userRoles = await this.prisma.userRole.findMany({
        where: { 
          userId: payload.userId,
          isActive: true 
        },
        select: { role: true }
      });

      const roles = userRoles.map(ur => ur.role);

      // Generate new token pair
      return this.generateTokenPair(payload.userId, payload.email, roles);

    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Revoke refresh token
   */
  async revokeRefreshToken(tokenId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { tokenId },
      data: { 
        isActive: false,
        revokedAt: new Date()
      }
    });
  }

  /**
   * Revoke all refresh tokens for a user
   */
  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId },
      data: { 
        isActive: false,
        revokedAt: new Date()
      }
    });
  }

  /**
   * Store refresh token in database
   */
  private async storeRefreshToken(userId: string, tokenId: string, token: string): Promise<void> {
    const expiresAt = this.calculateExpirationDate();

    await this.prisma.refreshToken.create({
      data: {
        tokenId,
        userId,
        token: token.substring(0, 50) + '...', // Store partial token for identification
        expiresAt,
        isActive: true,
      }
    });
  }

  private calculateExpirationDate(): Date {
    const expiresIn = this.refreshTokenExpiresIn;
    const expiresAt = new Date();
    
    // Parse the expiration string (e.g., '7d', '30d', '1h', '24h')
    const match = expiresIn.match(/^(\d+)([dhms])$/);
    if (!match) {
      throw new Error(`Invalid JWT_REFRESH_TOKEN_EXPIRES_IN format: ${expiresIn}. Use format like '7d', '30d', '1h', '24h'`);
    }
    
    const value = parseInt(match[1], 10);
    const unit = match[2];
    
    switch (unit) {
      case 'd':
        expiresAt.setDate(expiresAt.getDate() + value);
        break;
      case 'h':
        expiresAt.setHours(expiresAt.getHours() + value);
        break;
      case 'm':
        expiresAt.setMinutes(expiresAt.getMinutes() + value);
        break;
      case 's':
        expiresAt.setSeconds(expiresAt.getSeconds() + value);
        break;
      default:
        throw new Error(`Unsupported time unit: ${unit}. Use 'd', 'h', 'm', or 's'`);
    }
    
    return expiresAt;
  }

  /**
   * Clean up expired refresh tokens
   */
  async cleanupExpiredTokens(): Promise<number> {
    const result = await this.prisma.refreshToken.updateMany({
      where: {
        expiresAt: {
          lt: new Date()
        },
        isActive: true
      },
      data: {
        isActive: false
      }
    });

    return result.count;
  }

  /**
   * Get active token count for user
   */
  async getUserActiveTokenCount(userId: string): Promise<number> {
    return this.prisma.refreshToken.count({
      where: {
        userId,
        isActive: true,
        expiresAt: {
          gt: new Date()
        }
      }
    });
  }
}
