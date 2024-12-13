// database-orders.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from '../entities/order-item.entity';
import { Order } from '../entities/orders.entity';
import { Payment } from '../entities/payment.entity';
import { Shipping } from '../entities/shipping.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'orders_db',
      entities: [
        // your orders entities here
        OrderItem,
        Order,
        Payment,
        Shipping,
      ],
      synchronize: true,
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseOrdersModule {}
