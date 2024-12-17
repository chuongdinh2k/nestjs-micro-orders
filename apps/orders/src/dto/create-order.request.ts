import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class Item {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}

export class CreateOrderRequest {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Item)
  items: Item[];

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  shippingId: number;

  @IsNotEmpty()
  @IsNumber()
  paymentId: number;

  //   @IsNotEmpty()
  //   @IsNumber()
  //   @IsEnum(EOrderStatus)
  //   status: number;
}
