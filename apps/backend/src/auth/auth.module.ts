import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { DatabaseModule } from '../database/database.module';
import { AccountLockoutService } from './account-lockout.service';
import { AuditModule } from '../audit/audit.module';
import { AccountManagementController } from './account-management.controller';

@Module({
  imports: [
    DatabaseModule,
    AuditModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'fallback-secret'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '24h'), // Default, overridden by practice settings in AuthService
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, AccountManagementController],
  providers: [AuthService, JwtStrategy, AccountLockoutService],
  exports: [AuthService, AccountLockoutService],
})
export class AuthModule {} 