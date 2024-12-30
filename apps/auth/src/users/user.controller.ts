import { Controller, Get, Injectable, Query } from '@nestjs/common';
import { UsersService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  async getUserByEmail(@Query('email') email: string) {
    const user = await this.usersService.getUser({ email });
    return this.usersService.getUser({ email });
  }
}
