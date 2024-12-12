import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SharedModule } from '@app/shared';
import { DatabaseOrdersModule } from './database/database.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [SharedModule, DatabaseOrdersModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
