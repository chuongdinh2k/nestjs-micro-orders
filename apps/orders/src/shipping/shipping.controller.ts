import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { Shipping } from '../entities/shipping.entity';
import { CreateShippingRequest } from '../dto/create-shipping.request';

@Controller('orders/shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Get()
  getAllShippings(): Promise<Shipping[]> {
    return this.shippingService.listShippings();
  }

  @Get(':id')
  getShippingById(@Param('id') id: number): Promise<Shipping> {
    return this.shippingService.getShipping({ id });
  }

  @Post()
  createShipping(@Body() shipping: CreateShippingRequest): Promise<Shipping> {
    return this.shippingService.createShipping(shipping);
  }
}
