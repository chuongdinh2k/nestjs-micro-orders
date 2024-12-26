import { Model, Connection } from 'mongoose';
import { AbstractRepository } from '@app/shared';
import { Injectable, Logger } from '@nestjs/common';
import { Product } from './schemas/product.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProductsRepository extends AbstractRepository<Product> {
  protected readonly logger = new Logger(ProductsRepository.name);

  constructor(
    @InjectModel(Product.name) userModel: Model<Product>,
    @InjectConnection() connection: Connection,
  ) {
    super(userModel, connection);
  }
}
