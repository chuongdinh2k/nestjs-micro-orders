import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseBillingsModule } from './database/database.module';
import { BillingService } from './billing.service';
import { RmqModule, SharedModule } from '@app/shared';
import { Trx } from './entities/transaction.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_BILLING_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/billing/.env',
    }),
    SharedModule,
    RmqModule.register({
      name: 'ORDERS',
    }),
    TypeOrmModule.forFeature([Trx]),
    DatabaseBillingsModule,
  ],
  controllers: [BillingController],
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingModule {}
