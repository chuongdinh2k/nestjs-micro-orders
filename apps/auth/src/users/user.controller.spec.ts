import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UsersService } from './user.service';
const testCat1 = 'Test Cat 1';
const testBreed1 = 'Test Breed 1';
const testEmail = 'test@example.com';

describe('UserController', () => {
  let controller: UserController;
  let service: UsersService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getAll: jest.fn().mockResolvedValue([
              { name: testCat1, breed: testBreed1, age: 4 },
              { name: 'Test Cat 2', breed: 'Test Breed 2', age: 3 },
              { name: 'Test Cat 3', breed: 'Test Breed 3', age: 2 },
            ]),
            getOne: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                name: testCat1,
                breed: testBreed1,
                age: 4,
                id,
              }),
            ),
            getUser: jest.fn().mockImplementation((email: string) =>
              Promise.resolve({
                email,
                id: 1,
                last_name: 'John',
                first_name: 'Doe',
              }),
            ),
            getOneByName: jest
              .fn()
              .mockImplementation((name: string) =>
                Promise.resolve({ name, breed: testBreed1, age: 4 }),
              ),
            insertOne: jest
              .fn()
              .mockImplementation((cat: any) =>
                Promise.resolve({ id: 'a uuid', ...cat }),
              ),
            updateOne: jest
              .fn()
              .mockImplementation((cat: any) =>
                Promise.resolve({ id: 'a uuid', ...cat }),
              ),
            deleteOne: jest.fn().mockResolvedValue({ deleted: true }),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('/users?email=', () => {
    it('should return a user', async () => {
      await expect(controller.getUserByEmail(testEmail)).resolves.toEqual({
        email: testEmail,
        id: 1,
        last_name: 'John',
        first_name: 'Doe',
      });
    });
  });
});
