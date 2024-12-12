import { Injectable } from '@nestjs/common';
import { CreateUserRequest } from './users/dto/create-user.request';
import { UsersService } from './users/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}
  getHello(): string {
    return 'Hello World!';
  }

  async signUp(request: CreateUserRequest) {
    const result = await this.usersService.createUser(request);
    return result;
  }
}
