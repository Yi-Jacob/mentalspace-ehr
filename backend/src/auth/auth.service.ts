import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    // For demo purposes, we'll create a simple authentication
    // In a real application, you would hash passwords and implement proper authentication
    
    const user = await this.prisma.user.findFirst({
      where: { email: loginDto.email },
    });

    if (!user) {
      // For demo purposes, create a user if it doesn't exist
      const emailPrefix = loginDto.email.split('@')[0];
      const newUser = await this.prisma.user.create({
        data: {
          email: loginDto.email,
          firstName: emailPrefix,
          lastName: 'User',
        },
      });
      
      const payload = { email: newUser.email, sub: newUser.id };
      return {
        access_token: this.jwtService.sign(payload),
        user: newUser,
      };
    }

    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
} 