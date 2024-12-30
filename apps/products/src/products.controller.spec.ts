import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { AuthModule, RmqModule } from '@app/shared';
import { ConfigModule } from '@nestjs/config';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;
  let products = {
    name: 'Test Product',
    description: 'Test Product Description',
    price: 10,
    thumbnail: 'test-thumbnail.jpg',
    images: ['test-image1.jpg', 'test-image2.jpg'],
    categories: ['test-category1', 'test-category2'],
    stock: 10,
  };
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, RmqModule, ConfigModule],
      controllers: [ProductsController],
      providers: [
        AuthModule,
        {
          provide: ProductsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([products]),
          },
        },
      ],
    }).compile();

    controller = app.get<ProductsController>(ProductsController);
    service = app.get<ProductsService>(ProductsService);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
