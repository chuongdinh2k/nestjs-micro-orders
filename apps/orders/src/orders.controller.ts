import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderRequest } from './dto/create-order.request';
import { Order } from './entities/orders.entity';
import { EventPattern } from '@nestjs/microservices';
import { IBillingStatusPayload } from './types/payload.interface';

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
  getAllOrders(): Promise<any[]> {
    return this.ordersService.getOrders();
  }

  @Get(':id')
  getOrderById(@Param('id') id: number): Promise<Order> {
    return this.ordersService.getOrder({ id });
  }

  @EventPattern('billing_process')
  async handleBillingStatus(payload: IBillingStatusPayload) {
    try {
      console.log('received data: ', payload);
      const order = await this.ordersService.updateOrderStatus(
        payload.orderId,
        payload.status,
      );
      console.log('Order status updated: ', order);
    } catch (error) {
      console.error('Error processing billing_status event', error);
    }
  }
}
