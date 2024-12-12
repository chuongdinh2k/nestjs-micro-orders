import { Controller, Injectable } from '@nestjs/common';
import { UsersService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsersService) {}
}
