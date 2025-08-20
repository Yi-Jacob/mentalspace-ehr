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
      client.data.user = payload;
      client.data.userId = payload.id;

      return true;
    } catch (err) {
      throw new WsException('Invalid authentication token');
    }
  }
}
