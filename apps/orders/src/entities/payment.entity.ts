import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Order } from './orders.entity';

@Entity({ name: 'payments' })
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  method: number;

  @Column({ type: 'int' })
  status: number;

  @OneToMany(() => Order, (order) => order.payment)
  orders: Order[];
}
