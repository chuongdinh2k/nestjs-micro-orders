import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderRequest } from './dto/create-order.request';
import { Order } from './entities/orders.entity';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { IBillingStatusPayload } from './types/payload.interface';
import { JwtAuthGuard, RmqService } from '@app/shared';
import { transformOrderData } from './helpers/transform-data';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly rmqService: RmqService,
  ) {}

  @Get('health')
  healthCheck(): string {
    return this.ordersService.checkHealth();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createOrder(
    @Body() order: CreateOrderRequest,
    @Req() req: any,
  ): Promise<Order> {
    return this.ordersService.createOrder(order, req.cookies?.Authentication);
  }

  @Get()
  getAllOrders(): Promise<any[]> {
    return this.ordersService.getOrders();
  }

  @Get(':id')
  async getOrderById(@Param('id') id: number) {
    return transformOrderData(await this.ordersService.getOrder({ id }));
  }

  @EventPattern('billing_process')
  async handleBillingStatus(
    @Payload() payload: IBillingStatusPayload,
    @Ctx() context: RmqContext,
  ) {
    const order = await this.ordersService.updateOrderStatus(
      payload.orderId,
      payload.status,
    );
    if (order) {
      this.rmqService.ack(context);
    }
  }
}
