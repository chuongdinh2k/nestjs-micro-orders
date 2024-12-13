import { Injectable } from '@nestjs/common';
import { Shipping } from '../entities/shipping.entity';
import { BaseService } from '@app/shared';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateShippingRequest } from '../dto/create-shipping.request';

@Injectable()
export class ShippingService extends BaseService<Shipping> {
  constructor(
    @InjectRepository(Shipping)
    private readonly shippingRepository: Repository<Shipping>,
  ) {
    super(shippingRepository);
  }

  async createShipping(request: CreateShippingRequest): Promise<Shipping> {
    const shipping = this.shippingRepository.create(request);
    return this.store(shipping);
  }

  async getShipping(getShippingArgs: Partial<Shipping>): Promise<Shipping> {
    return this.findOne(getShippingArgs);
  }

  async listShippings(): Promise<Shipping[]> {
    return this.shippingRepository.find();
  }
}
