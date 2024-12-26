import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductRequest } from './dtos/create-product.request';
import { Product } from './schemas/product.schema';
import { Types } from 'mongoose';
import { ListProductResponse } from './types/product.interface';
import { JwtAuthGuard } from '@app/shared';
import { Request } from 'express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('health')
  checkHealth(): string {
    return this.productsService.checkHealth();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createProduct(
    @Body() product: CreateProductRequest,
    @Req() req: Request,
  ): Promise<Product> {
    return this.productsService.createProduct(product);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne({ _id: new Types.ObjectId(id) });
  }
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('name') name?: string,
    @Query('stock') stock?: number,
  ): Promise<ListProductResponse> {
    const filters: any = {};
    if (name) {
      filters.name = name;
    }
    if (stock !== undefined) {
      filters.stock = stock;
    }
    return this.productsService.findAll({ filters, page, limit });
  }

  @Put(':id')
  updateProduct(
    @Param('id') id: string,
    @Body() update: Partial<CreateProductRequest>,
  ): Promise<Product> {
    return this.productsService.updateProduct(id, update);
  }
}
