// import * as request from 'supertest';
// import { User } from './entities/user.entity';
// import { faker } from '@faker-js/faker/.';
// import { CreateUserRequest } from './dto/create-user.request';
// import { before } from 'node:test';
// import { Test, TestingModule } from '@nestjs/testing';
// import { UserModule } from './user.module';
// import { DatabaseAuthModule } from '../database/database.module';
// import { UserRepositoryProvider } from '../database/user.provider';
// import { DATA_SOURCE } from '../constants';
// import { DataSource } from 'typeorm/data-source';
// import {
//   DataSourceProvider,
//   getInitializedDataSource,
// } from '../database/database.provider';
// import * as dotenv from 'dotenv';
// import * as path from 'path';
// import { INestApplication } from '@nestjs/common';
// import { HelperService } from '../../test/helper.service';
// // Load environment variables from .env file
// dotenv.config({
//   path: path.resolve(__dirname, '../.env.local'),
// });
// console.log('process.env.DB_TEST_DATABASE', process.env.DB_TEST_DATABASE);
// describe('UsersService', () => {
//   const mockUserEmail = 'admin@gmail.com';
//   const requestMock: CreateUserRequest = {
//     /* mock request data */
//     email: faker.internet.email(),
//     firstName: faker.name.firstName(),
//     lastName: faker.name.lastName(),
//     password: faker.internet.password(),
//   };
//   const user: User = {
//     id: 1,
//     email: faker.internet.email(),
//     first_name: requestMock.firstName,
//     last_name: requestMock.lastName,
//     password: requestMock.password,
//     created_at: new Date(),
//     updated_at: new Date(),
//     is_active: false,
//   } as User;
//   let mocks: any;
//   beforeAll(async () => {
//     const app: TestingModule = await Test.createTestingModule({
//       imports: [DatabaseAuthModule, UserModule],
//       providers: [UserRepositoryProvider, HelperService, DataSourceProvider],
//     })
//       .overrideProvider(DATA_SOURCE)
//       .useFactory({
//         factory: async (): Promise<DataSource> => {
//           return getInitializedDataSource('auth_db', '3307');
//         },
//       })
//       .compile();

//     // insert data to test database before running tests
//     const helperService: HelperService = await app.resolve(HelperService);
//     await helperService.insertMockUserEmail(mockUserEmail);

//     // create mock server for testing
//     const mockApp: INestApplication = app.createNestApplication();
//     await mockApp.init();
//     const mockAppServer: any = mockApp.getHttpServer();

//     mocks = {
//       app: mockApp,
//       helperService,
//       appServer: mockAppServer,
//     };
//   });
//   it('should successfully find dog given name', async function () {
//     const response = await request(mocks.appServer).get(
//       `/users?name=${mockUserEmail}`,
//     );
//     const results = response.body;

//     expect(response.status).toBe(200);
//     expect(results.length).toBe(1);
//     expect(results[0].name).toBe(mockUserEmail);
//   });

//   afterAll(async function () {
//     await mocks.app.close();
//     await mocks.helperService.disconnectFromDatabase();
//   });
// });
describe('UsersService', () => {
  it('should call authenService.login and send the user in the response', async () => {});
});
