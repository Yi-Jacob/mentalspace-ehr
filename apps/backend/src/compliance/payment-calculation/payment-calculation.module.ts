import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { PaymentCalculationController } from './payment-calculation.controller';
import { PaymentCalculationService } from './payment-calculation.service';

@Module({
  imports: [DatabaseModule],
  controllers: [PaymentCalculationController],
  providers: [PaymentCalculationService],
  exports: [PaymentCalculationService],
})
export class PaymentCalculationModule {}
