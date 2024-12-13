import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderRequest } from './dto/create-order.request';
import { Order } from './entities/orders.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('health')
  healthCheck(): string {
    return this.ordersService.checkHealth();
  }

  @Post()
  createOrder(@Body() order: CreateOrderRequest): Promise<Order> {
    return this.ordersService.createOrder(order);
  }

  @Get()
  getAllOrders(): Promise<Order[]> {
    return this.ordersService.getOrders();
  }

  @Get(':id')
  getOrderById(@Param('id') id: number): Promise<Order> {
    return this.ordersService.getOrder({ id });
  }
}
