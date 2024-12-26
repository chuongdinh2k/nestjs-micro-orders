import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserRequest } from './dto/create-user.request';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { BaseService } from '@app/shared';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {
    super(usersRepository);
  }
  async createUser(request: CreateUserRequest): Promise<User> {
    const { firstName, lastName, email, password } = request;
    await this.validateCreateUserRequest(request);
    const user = this.usersRepository.create({
      first_name: firstName,
      last_name: lastName,
      email,
      password: await bcrypt.hash(password, 10),
    });
    return this.store({
      ...user,
      is_active: false,
    });
  }

  private async validateCreateUserRequest(request: CreateUserRequest) {
    let user: User;
    try {
      user = await this.usersRepository.findOne({
        where: { email: request.email },
      });
    } catch (err) {}

    if (user) {
      throw new UnprocessableEntityException('Email already exists.');
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return user;
  }

  async getUser(getUserArgs: Partial<User>) {
    return this.findOne(getUserArgs);
  }
}
