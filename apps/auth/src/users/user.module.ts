import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UsersService } from './user.service';
import { User } from './entities/user.entity';
import { UserRepositoryProvider } from '../database/user.provider';
import { DataSourceProvider } from '../database/database.provider';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UsersService, UserRepositoryProvider, DataSourceProvider],
  exports: [TypeOrmModule, UsersService],
})
export class UserModule {}
