import { Model, Types } from 'mongoose'
import { TUser } from '../user/user.interface'
import { TOrderStatus, TPaymentStatus } from './serviceBooking.constant'

export type TServiceBooking = {
  service: Types.ObjectId
  user: Types.ObjectId | TUser
  name: string
  email: string
  contactNumber: string
  amount: number
  status: TOrderStatus
  paymentStatus: TPaymentStatus
  transactionId?: string
  notes?: string
  isDeleted: boolean
}

export type TServiceBookingModel = Model<TServiceBooking, Record<string, unknown>>
