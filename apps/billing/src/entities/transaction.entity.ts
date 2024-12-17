import { EPaymentMethods } from '@app/shared';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { ETransactionStatus } from '../types/transaction-status.enum';

@Entity({ name: 'transactions' })
export class Trx extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'trx_id', unique: true })
  trxId: string;

  @Column({ name: 'user_id' })
  userId: number; // Reference to the user in the user service

  @Column({ name: 'order_id' })
  orderId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: EPaymentMethods })
  method: number;

  @Column({ type: 'enum', enum: ETransactionStatus })
  status: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor(partial: Partial<Trx>) {
    super();
    Object.assign(this, partial);
  }
}
