import { EPaymentMethods } from '@app/shared';
import { IsEnum, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateTrxRequest {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsNumber()
  @IsEnum(EPaymentMethods)
  method: number;

  @IsNotEmpty()
  @IsNumber()
  status: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  orderId: number;
}
