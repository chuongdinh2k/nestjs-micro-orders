import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './orders.module';
import { ValidationPipe } from '@nestjs/common';
import { RmqService } from '@app/shared';
import { RmqOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(OrdersModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice<RmqOptions>(rmqService.getOptions('ORDERS', true));
  await app.startAllMicroservices();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.port ?? 3002);
  console.log(`Microservice ORDERS started on port ${process.env.PORT}`);
}
bootstrap();
