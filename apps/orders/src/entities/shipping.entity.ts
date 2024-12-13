import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Order } from './orders.entity';

@Entity({ name: 'shippings' })
export class Shipping extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ type: 'varchar', length: 100 })
  address: string;

  @Column({ type: 'varchar', length: 50 })
  city: string;

  @Column({ type: 'varchar', length: 50 })
  state: string;

  @Column({ type: 'varchar', length: 20, name: 'postal_code' })
  postalCode: string;

  @Column({ type: 'varchar', length: 50 })
  country: string;

  @OneToMany(() => Order, (order) => order.shipping)
  orders: Order[];
}
