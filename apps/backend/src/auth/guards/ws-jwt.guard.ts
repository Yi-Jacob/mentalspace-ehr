import { CanActivate, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: any): boolean {
    try {
      const client: Socket = context.switchToWs().getClient();
      const token = client.handshake.auth.token || 
                   client.handshake.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        throw new WsException('Authentication token not found');
      }

      const payload = this.jwtService.verify(token);
      
      // JWT payload structure: { sub: userId, email: string, roles: string[], iat: number, exp: number }
      client.data.user = payload;
      client.data.userId = payload.sub; // Use 'sub' field for userId
      
      console.log('🟢 WsJwtGuard: JWT payload decoded:', { 
        userId: payload.sub, 
        email: payload.email,
        roles: payload.roles 
      });

      return true;
    } catch (err) {
      console.error('🟢 WsJwtGuard: JWT verification failed:', err);
      throw new WsException('Invalid authentication token');
    }
  }
}
