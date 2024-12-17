import { NestFactory } from '@nestjs/core';
import { BillingModule } from './billing.module';
import { ValidationPipe } from '@nestjs/common';
import { RmqService } from '@app/shared';

async function bootstrap() {
  const app = await NestFactory.create(BillingModule);
  app.useGlobalPipes(new ValidationPipe());
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('BILLING'));
  await app.startAllMicroservices();
  await app.listen(process.env.port ?? 3003);
  console.log(`Microservice BILLING started on port ${process.env.PORT}`);
}
bootstrap();
