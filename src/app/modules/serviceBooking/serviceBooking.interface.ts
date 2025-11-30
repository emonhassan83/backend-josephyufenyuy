import { Model, Types } from 'mongoose'
import { TUser } from '../user/user.interface'
import { TOrderStatus, TPaymentStatus } from './serviceBooking.constant'

export type TServiceBooking = {
  service: Types.ObjectId
  user: Types.ObjectId | TUser
  amount: number
  status: TOrderStatus
  paymentStatus: TPaymentStatus
  transactionId?: string
  notes?: string
}

export type TServiceBookingModel = Model<TServiceBooking, Record<string, unknown>>
