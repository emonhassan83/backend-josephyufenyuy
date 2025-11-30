import { Model, Types } from 'mongoose';
import { TPaymentStatus } from './payment.constants';

export interface TPayment {
  _id: string
  id: string
  user: Types.ObjectId
  order: Types.ObjectId
  transactionId: string
  paymentIntentId: string
  amount: number
  status: TPaymentStatus
  isPaid: boolean
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}

export type TPaymentModel = Model<TPayment, Record<string, string>>;
