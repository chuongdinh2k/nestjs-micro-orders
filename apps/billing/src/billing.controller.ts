import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BillingService } from './billing.service';
import { CreateTrxRequest } from './dto/create-trx.request';
import { Trx } from './entities/transaction.entity';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/shared';

@Controller('billing')
export class BillingController {
  constructor(
    private readonly billingService: BillingService,
    private readonly rmqService: RmqService,
  ) {}

  @Get('health')
  healthCheck(): string {
    return this.billingService.checkHealth();
  }

  @Post('transactions')
  createTrx(@Body() trxRequest: CreateTrxRequest): Promise<Trx> {
    return this.billingService.createTrx(trxRequest);
  }

  @Get('transactions')
  getListTrx(): Promise<Trx[]> {
    return this.billingService.getListTrx();
  }

  @Get('transactions/:id')
  getTrxById(@Param('id') id: string): Promise<Trx> {
    return this.billingService.getTrx({ trxId: id });
  }

  @EventPattern('order_created')
  // @UseGuards(JwtAuthGuard)
  async handleOrderCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('received data: ', data);
    const trx = await this.billingService.createTrx(data);
    if (trx) {
      this.rmqService.ack(context);
    }
    this.rmqService.ack(context);
  }
}
