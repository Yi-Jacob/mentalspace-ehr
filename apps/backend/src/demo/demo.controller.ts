import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../database/prisma.service';

@ApiTags('Demo')
@Controller('demo')
export class DemoController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Demo endpoint' })
  @ApiResponse({ status: 200, description: 'Demo endpoint working' })
  getDemo() {
    return {
      message: 'MentalSpace EHR API is working!',
      timestamp: new Date().toISOString(),
      status: 'success',
      features: [
        'Nest.js backend running',
        'Swagger documentation available',
        'Prisma ORM configured',
        'Ready for database connection'
      ]
    };
  }

  @Get('db-test')
  @ApiOperation({ summary: 'Test database connection' })
  @ApiResponse({ status: 200, description: 'Database connection test result' })
  async testDatabaseConnection() {
    try {
      // Test the database connection
      await this.prisma.$queryRaw`SELECT 1 as test`;
      
      return {
        message: 'Database connection successful!',
        timestamp: new Date().toISOString(),
        status: 'success',
        database: 'AWS RDS PostgreSQL',
        connection: 'active'
      };
    } catch (error) {
      return {
        message: 'Database connection failed',
        timestamp: new Date().toISOString(),
        status: 'error',
        error: error.message,
        database: 'AWS RDS PostgreSQL',
        connection: 'failed'
      };
    }
  }

  @Post('test')
  @ApiOperation({ summary: 'Test POST endpoint' })
  @ApiResponse({ status: 200, description: 'Test data received' })
  testPost(@Body() data: any) {
    return {
      message: 'POST request received successfully',
      receivedData: data,
      timestamp: new Date().toISOString(),
      status: 'success'
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  healthCheck() {
    return {
      status: 'healthy',
      service: 'MentalSpace EHR Backend',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    };
  }
} 