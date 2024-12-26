import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { AuthModule, RmqModule, SharedModule } from '@app/shared';
import { DatabaseOrdersModule } from './database/database.module';
import { ShippingModule } from './shipping/shipping.module';
import { Order } from './entities/orders.entity';
import { OrderItem } from './entities/order-item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentModule } from './payment/payment.module';
import { ShippingService } from './shipping/shipping.service';
import { PaymentService } from './payment/payment.service';
import { Shipping } from './entities/shipping.entity';
import { Payment } from './entities/payment.entity';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
      }),
      envFilePath: './apps/orders/.env.local',
    }),
    TypeOrmModule.forFeature([Order, OrderItem, Payment, Shipping]),
    SharedModule,
    DatabaseOrdersModule,
    ShippingModule,
    PaymentModule,
    RmqModule.register({
      name: 'BILLING',
    }),
    AuthModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, ShippingService, PaymentService],
  exports: [TypeOrmModule],
})
export class OrdersModule {}
