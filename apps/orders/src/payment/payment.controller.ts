import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Payment } from '../entities/payment.entity';
import { CreatePaymentRequest } from '../dto/create-payment.request';

@Controller('orders/payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  getAllPayments(): Promise<Payment[]> {
    return this.paymentService.listPayments();
  }

  @Get(':id')
  getPaymentById(@Param('id') id: number): Promise<Payment> {
    return this.paymentService.getPayment({ id });
  }

  @Post()
  createPayment(@Body() payment: CreatePaymentRequest): Promise<Payment> {
    return this.paymentService.createPayment(payment);
  }
}
