import { Injectable, NotFoundException } from '@nestjs/common';
import { Order } from './entities/orders.entity';
import { BaseService } from '@app/shared';
import { CreateOrderRequest, Item } from './dto/create-order.request';
import { Connection, EntityManager, Repository } from 'typeorm';
import { ShippingService } from './shipping/shipping.service';
import { OrderItem } from './entities/order-item.entity';
import { PaymentService } from './payment/payment.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrdersService extends BaseService<Order> {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly shippingService: ShippingService,
    private readonly paymentService: PaymentService,
    private readonly connection: Connection,
  ) {
    super(ordersRepository);
  }
  checkHealth(): string {
    return 'app is alive';
  }

  async getOrders(): Promise<Order[]> {
    return this.ordersRepository.find();
  }

  async getOrder(getOrderArgs: Partial<Order>): Promise<Order> {
    const order = await this.findOne(getOrderArgs);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async createOrderItem(
    item: Item,
    order: Order,
    manager: EntityManager,
  ): Promise<OrderItem> {
    const { productId, quantity, price, name } = item;

    const orderItem = manager.create(OrderItem, {
      order,
      productId,
      quantity,
      price,
      name,
    });
    return manager.save(OrderItem, orderItem);
  }

  async createOrder(request: CreateOrderRequest): Promise<Order> {
    return this.connection.transaction(async (manager: EntityManager) => {
      const { items, userId, shippingId, paymentId } = request;
      const totalAmount = this.calculateTotalAmount(items);
      const shipping = await this.shippingService.getShipping({
        id: shippingId,
      });
      const payment = await this.paymentService.getPayment({ id: paymentId });

      if (!shipping || !payment) {
        throw new Error('Shipping or payment not found');
      }

      const order = manager.create(Order, {
        shipping,
        status: 0, // default is pending
        userId,
        totalAmount,
        payment,
      });

      const savedOrder = await manager.save(Order, order);

      const orderItemsPromises = items.map((item) =>
        this.createOrderItem(item, savedOrder, manager),
      );

      await Promise.all(orderItemsPromises);

      return savedOrder;
    });
  }

  calculateTotalAmount(items: Item[]): number {
    return items.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);
  }
}
