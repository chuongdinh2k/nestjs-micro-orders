import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { Payment } from './payment.entity';
import { Shipping } from './shipping.entity';
import { EOrderStatus } from '@app/shared';

@Entity({ name: 'orders' })
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number; // Reference to the user in the user service

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: OrderItem[];

  @ManyToOne(() => Payment, (payment) => payment.orders, { cascade: true })
  @JoinColumn({ name: 'payment_id' })
  payment: Payment;

  @ManyToOne(() => Shipping, (shipping) => shipping.orders, { cascade: true })
  @JoinColumn({ name: 'shipping_id' })
  shipping: Shipping;

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'int' })
  status: EOrderStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor(partial: Partial<Order>) {
    super();
    Object.assign(this, partial);
  }
}
