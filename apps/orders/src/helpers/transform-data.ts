import { EPaymentMethods, EPaymentStatus } from '@app/shared';
import { Order } from '../entities/orders.entity';

export const transformOrderData = (data: Order) => {
  const { id, items, shipping, payment, totalAmount, userId, status } = data;
  console.log('item', items);
  return {
    id,
    userId,
    items,
    shipping,
    payment: {
      method: transFormPaymentMethod(payment.method),
      status: transformPaymentStatus(payment.status),
    },
    totalAmount,
    status: transformOrderStatus(status),
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  };
};

export const transFormPaymentMethod = (
  paymentMethod: EPaymentMethods,
): string => {
  switch (paymentMethod) {
    case EPaymentMethods.CASH_ON_DELIVERY:
      return 'cash_on_delivery';
    case EPaymentMethods.CREDIT_CARD:
      return 'credit_card';
    case EPaymentMethods.PAYPAL:
      return 'paypal';
    case EPaymentMethods.BANK_TRANSFER:
      return 'bank_transfer';
    case EPaymentMethods.APPLE_PAY:
      return 'apple_pay';
    case EPaymentMethods.GOOGLE_PAY:
      return 'google_pay';
    default:
      return 'cash_on_delivery';
  }
};

export const transformPaymentStatus = (
  paymentStatus: EPaymentStatus,
): string => {
  switch (paymentStatus) {
    case EPaymentStatus.PENDING:
      return 'pending';
    case EPaymentStatus.PAID:
      return 'paid';
    case EPaymentStatus.CANCELED:
      return 'canceled';
    default:
      return 'pending';
  }
};

export const transformOrderStatus = (orderStatus: number): string => {
  switch (orderStatus) {
    case 0:
      return 'processing';
    case 1:
      return 'processed';
    case 2:
      return 'completed';
    case 3:
      return 'canceled';
    default:
      return 'pending';
  }
};
