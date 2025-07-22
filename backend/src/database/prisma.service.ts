import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private readonly maxRetries = 5;
  private readonly retryDelay = 1000; // 1 second

  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }

  async onModuleInit() {
    await this.connectWithRetry();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private async connectWithRetry(): Promise<void> {
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        this.logger.log(`Attempting to connect to database (attempt ${attempt}/${this.maxRetries})`);
        await this.$connect();
        this.logger.log('Successfully connected to database');
        return;
      } catch (error) {
        this.logger.error(`Database connection attempt ${attempt} failed: ${error.message}`);
        
        if (attempt === this.maxRetries) {
          this.logger.error('Max retry attempts reached. Failed to connect to database.');
          throw error;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
      }
    }
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'test') {
      const models = Reflect.ownKeys(this).filter((key) => key[0] !== '_');
      
      return Promise.all(
        models.map((modelKey) => this[modelKey as string].deleteMany())
      );
    }
  }
} 