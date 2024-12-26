import { HttpException, Injectable } from '@nestjs/common';
import { ProductsRepository } from './product.repository';
import { CreateProductRequest } from './dtos/create-product.request';
import { Product } from './schemas/product.schema';
import { ListProductResponse } from './types/product.interface';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  checkHealth(): string {
    return 'app is alive';
  }

  async createProduct(
    createProductRequest: CreateProductRequest,
  ): Promise<Product> {
    createProductRequest;
    const product = await this.findOne({ name: createProductRequest.name });
    if (product) {
      throw new HttpException(
        `Product ${createProductRequest.name} already exists`,
        409,
      );
    }
    return this.productsRepository.create(createProductRequest);
  }

  async findOne(args: Partial<Product>): Promise<Product> {
    return this.productsRepository.findOne(args);
  }

  async findAll({
    filters,
    page,
    limit,
  }: {
    filters: Partial<Product>;
    page: number;
    limit: number;
  }): Promise<ListProductResponse> {
    const skip = (page - 1) * limit;
    const products = await this.productsRepository.find(filters, skip, limit);
    const total = await this.productsRepository.countDocuments(filters);
    return {
      data: products,
      total,
      page: parseInt(page.toString()),
      limit: parseInt(limit.toString()),
    };
  }

  async updateProduct(id: string, update: Partial<Product>): Promise<Product> {
    return this.productsRepository.findOneAndUpdate(
      { _id: id },
      { $set: update },
    );
  }
}
