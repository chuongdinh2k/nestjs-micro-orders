import { IsEnum, IsNotEmpty } from 'class-validator';
import { EPaymentMethods, EPaymentStatus } from '../types/payment.enum';

export class CreatePaymentRequest {
  @IsNotEmpty()
  @IsEnum(EPaymentMethods)
  method: number;

  @IsNotEmpty()
  @IsEnum(EPaymentStatus)
  status: number;
}
