export const ORDER_STATUS = {
  pending: 'pending',
  processing: 'processing',
  cancelled: 'cancelled'
 } as const

export const PAYMENT_STATUS = {
  unpaid: 'unpaid',
  paid: 'paid',
  failed: 'failed',
  refunded: 'refunded'
 } as const

 export type TOrderStatus = keyof typeof ORDER_STATUS
 export type TPaymentStatus = keyof typeof PAYMENT_STATUS