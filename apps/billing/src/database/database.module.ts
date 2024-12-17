// database-orders.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trx } from '../entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'billing_db',
      entities: [Trx],
      synchronize: true,
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseBillingsModule {}
