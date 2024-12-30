import { BaseService } from '@app/shared';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Trx } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTrxRequest } from './dto/create-trx.request';
import { v4 as uuidv4 } from 'uuid';
import { ClientProxy } from '@nestjs/microservices';
@Injectable()
export class BillingService extends BaseService<Trx> {
  constructor(
    @InjectRepository(Trx)
    private readonly transactionRepository: Repository<Trx>,
    @Inject('ORDERS') private ordersClient: ClientProxy,
  ) {
    super(transactionRepository);
  }
  checkHealth(): string {
    return 'app is alive';
  }

  async getListTrx(): Promise<Trx[]> {
    return this.transactionRepository.find();
  }

  async getTrx(getTrxArgs: Partial<Trx>): Promise<Trx> {
    const trx = await this.findOne(getTrxArgs);
    if (!trx) {
      throw new NotFoundException(`Transaction ${getTrxArgs.trxId} not found`);
    }
    return trx;
  }
  async createTrx(request: CreateTrxRequest): Promise<Trx> {
    const { method, orderId, userId } = request;
    const trxId = uuidv4();
    try {
      const trx = this.transactionRepository.create({
        orderId,
        trxId,
        method,
        status: 0,
        userId: 1,
      });
      const savedTrx = await this.transactionRepository.save(trx);
      // Simulate billing processing for 10 seconds
      setTimeout(async () => {
        savedTrx.status = 1; // Update status to completed
        await this.transactionRepository.save(savedTrx);

        // Emit an event to notify the Order service
        this.queueOrder(savedTrx);
      }, 10000); // 10 seconds delay

      return savedTrx;
    } catch (err) {
      console.log('err', err);
    }
  }

  private queueOrder(trx: Trx) {
    this.ordersClient
      .emit('billing_process', {
        trxId: trx.trxId,
        status: trx.status,
        orderId: trx.orderId,
      })
      .subscribe({
        next: () =>
          console.log(`Billing operation queued for order: ${trx.trxId}`),
        error: (err) =>
          console.error(
            `Failed to queue billing operation for order: ${trx.trxId}`,
            err,
          ),
      });
  }
}
