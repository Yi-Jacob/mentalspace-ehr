import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { DatabaseHealthIndicator } from './health/database.health';

@Module({
  providers: [PrismaService, DatabaseHealthIndicator],
  exports: [PrismaService, DatabaseHealthIndicator],
})
export class DatabaseModule {} 