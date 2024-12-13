import { Injectable } from '@nestjs/common';
import { CreateUserRequest } from './users/dto/create-user.request';
import { UsersService } from './users/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from './users/entities/user.entity';
import { TokenPayload } from './types/auth.interface';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async login(user: User, response: Response) {
    const tokenPayload: TokenPayload = {
      email: user.email,
    };

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );

    const token = this.jwtService.sign(tokenPayload);

    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });
  }

  async signUp(request: CreateUserRequest) {
    const result = await this.usersService.createUser(request);
    return result;
  }
}
