import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Order } from './entities/orders.entity';
import { BaseService, EOrderStatus, ETransactionStatus } from '@app/shared';
import { CreateOrderRequest, Item } from './dto/create-order.request';
import { Connection, EntityManager, Repository } from 'typeorm';
import { ShippingService } from './shipping/shipping.service';
import { OrderItem } from './entities/order-item.entity';
import { PaymentService } from './payment/payment.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { transformOrderData } from './helpers/transform-data';

@Injectable()
export class OrdersService extends BaseService<Order> {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    private readonly shippingService: ShippingService,
    private readonly paymentService: PaymentService,
    private readonly connection: Connection,
    @Inject('BILLING') private billingClient: ClientProxy,
  ) {
    super(ordersRepository);
  }
  checkHealth(): string {
    return 'app is alive';
  }

  async getOrders(): Promise<any[]> {
    const orders = await this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('order.payment', 'payment')
      .leftJoinAndSelect('order.shipping', 'shipping')
      .getMany();
    return orders ? orders.map((order) => transformOrderData(order)) : [];
  }

  async getOrder(getOrderArgs: Partial<Order>): Promise<any> {
    const order = await this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('order.payment', 'payment')
      .leftJoinAndSelect('order.shipping', 'shipping')
      .where('order.id = :id', { id: getOrderArgs.id })
      .getOne();
    console.log('order', order);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return transformOrderData(order);
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
    const { items, userId, shippingId, paymentId } = request;
    const shipping = await this.shippingService.getShipping({
      id: shippingId,
    });
    const payment = await this.paymentService.getPayment({ id: paymentId });
    const totalAmount = this.calculateTotalAmount(items);
    if (!shipping || !payment) {
      throw new Error('Shipping or payment not found');
    }
    return this.connection.transaction(async (manager: EntityManager) => {
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
      this.queueBilling(savedOrder);
      return savedOrder;
    });
  }

  private queueBilling(order: Order) {
    // Send a message to the billing queue
    this.billingClient
      .emit('order_created', {
        orderId: order.id,
        userId: order.userId,
        amount: order.totalAmount,
      })
      .subscribe({
        next: () =>
          console.log(`Billing operation queued for order: ${order.id}`),
        error: (err) =>
          console.error(
            `Failed to queue billing operation for order: ${order.id}`,
            err,
          ),
      });
    // this.logger.log('Billing operation queued for order:', order);
  }

  async updateOrderStatus(
    orderId: number,
    trxStatus: ETransactionStatus,
  ): Promise<Order> {
    const order = await this.getOrder({ id: orderId });
    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }
    if (trxStatus === ETransactionStatus.COMPLETED) {
      order.status = EOrderStatus.PROCESSED;
    } else {
      order.status = EOrderStatus.CANCELED;
    }
    return this.ordersRepository.save(order);
  }

  calculateTotalAmount(items: Item[]): number {
    return items.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);
  }
}
