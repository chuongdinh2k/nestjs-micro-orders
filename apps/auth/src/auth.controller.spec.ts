import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserRequest } from './users/dto/create-user.request';
import { User } from './users/entities/user.entity';
import { SaveOptions, RemoveOptions } from 'typeorm';
import { UsersService } from './users/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { faker } from '@faker-js/faker/.';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let userService: UsersService;
  const request: CreateUserRequest = {
    /* mock request data */
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    password: faker.internet.password(),
  };
  beforeEach(async () => {
    const mockUserService = {
      create: jest.fn(),
      findOne: jest.fn(),
    };
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: './apps/auth/.env.local',
        }),
        JwtModule.registerAsync({
          useFactory: (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: {
              expiresIn: `${configService.get('JWT_EXPIRATION')}s`,
            },
          }),
          inject: [ConfigService],
        }),
      ],
      providers: [
        AuthService,
        JwtService,
        LocalStrategy,
        JwtStrategy,
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    authController = app.get<AuthController>(AuthController);
    authService = app.get<AuthService>(AuthService);
    userService = app.get<UsersService>(UsersService);
  });

  describe('signUp', () => {
    it('should return a user', async () => {
      const user: User = {
        id: 1,
        email: faker.internet.email(),
        first_name: request.firstName,
        last_name: request.lastName,
        password: request.password,
        created_at: new Date(),
        updated_at: new Date(),
        is_active: false,
      } as User;
      jest.spyOn(authService, 'signUp').mockResolvedValue(user);
      const result = await authController.signUp(request);
      expect(authService.signUp).toHaveBeenCalledWith(request);
      expect(result).toEqual(user);
    });
  });

  describe('login', () => {
    it('should call authenService.login and send the user in the response', async () => {
      const user: User = {
        id: 1,
        email: faker.internet.email(),
        first_name: request.firstName,
        last_name: request.lastName,
        password: request.password,
        created_at: new Date(),
        updated_at: new Date(),
        is_active: false,
      } as User;
      const response = {
        send: jest.fn(),
      };
      jest.spyOn(authService, 'login').mockResolvedValue(undefined);
      await authController.login(user, response as any);
      expect(authService.login).toHaveBeenCalledWith(user, response);
      expect(response.send).toHaveBeenCalledWith(user);
    });
  });
});
