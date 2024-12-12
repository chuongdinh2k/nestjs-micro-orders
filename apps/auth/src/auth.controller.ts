import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserRequest } from './users/dto/create-user.request';
import { User } from './users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getHello(): string {
    return this.authService.getHello();
  }

  @Post('signup')
  signUp(@Body() request: CreateUserRequest): Promise<User> {
    console.log('runhere');
    return this.authService.signUp(request);
  }
}
