import { Module } from '@nestjs/common';
import { DemoController } from './demo.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [DemoController],
  providers: [PrismaService],
})
export class DemoModule {} 