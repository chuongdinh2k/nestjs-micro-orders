// database-orders.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'orders_database',
      entities: [
        // your orders entities here
        User,
      ],
      synchronize: true,
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseOrdersModule {}
