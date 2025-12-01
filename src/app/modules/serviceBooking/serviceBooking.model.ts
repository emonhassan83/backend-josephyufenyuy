import { Schema, model, Types } from 'mongoose'
import {
  TServiceBooking,
  TServiceBookingModel,
} from './serviceBooking.interface'
import { ORDER_STATUS, PAYMENT_STATUS } from './serviceBooking.constant'

const serviceBookingSchema = new Schema<TServiceBooking>(
  {
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.pending,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.unpaid,
    },
    transactionId: {
      type: String,
      default: null,
    },
    notes: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
)

export const ServiceBooking = model<TServiceBooking, TServiceBookingModel>(
  'ServiceBooking',
  serviceBookingSchema,
)
