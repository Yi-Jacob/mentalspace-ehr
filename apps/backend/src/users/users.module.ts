import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { PasswordValidationService } from '../common/validation/password-validation.service';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [UsersController],
  providers: [UsersService, PasswordValidationService],
  exports: [UsersService, PasswordValidationService],
})
export class UsersModule {} 