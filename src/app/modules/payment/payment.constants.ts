export const PAYMENT_STATUS = {
  unpaid: 'unpaid',
  paid: 'paid',
  refunded: 'refunded',
  failed: 'failed',
} as const

export type TPaymentStatus = keyof typeof PAYMENT_STATUS
