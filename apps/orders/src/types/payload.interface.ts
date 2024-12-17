import { ETransactionStatus } from '@app/shared';

export interface IBillingStatusPayload {
  orderId: number;
  status: ETransactionStatus;
  trxId: string;
}
