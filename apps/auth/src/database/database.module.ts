// database-orders.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getDataSourceOptions } from './database.provider';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const options = getDataSourceOptions();
        return {
          ...options,
          migrations: [__dirname + '/migrations/*{.ts,.js}'],
          cli: {
            migrationsDir: 'src/migrations',
          },
          synchronize: true, // should be false in production
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseAuthModule {}
