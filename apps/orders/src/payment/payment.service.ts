import { Injectable } from '@nestjs/common';
import { BaseService } from '@app/shared';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from '../entities/payment.entity';
import { CreatePaymentRequest } from '../dto/create-payment.request';

@Injectable()
export class PaymentService extends BaseService<Payment> {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {
    super(paymentRepository);
  }

  async createPayment(request: CreatePaymentRequest): Promise<Payment> {
    const shipping = this.paymentRepository.create(request);
    return this.store(shipping);
  }

  async getPayment(getPaymentArgs: Partial<Payment>): Promise<Payment> {
    return this.findOne(getPaymentArgs);
  }

  async listPayments(): Promise<Payment[]> {
    return this.paymentRepository.find();
  }
}
