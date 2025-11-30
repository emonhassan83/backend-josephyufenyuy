import mongoose, { Schema } from 'mongoose'
import {
  TPayment,
  TPaymentModel,
} from './payment.interface'
import { PAYMENT_STATUS } from './payment.constants'
import { generateCryptoString } from '../../utils/generateCryptoString'

const PaymentSchema: Schema = new Schema<TPayment>(
  {
    id: {
      type: String,
      unique: true,
      default: () => generateCryptoString(10),
    },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    order: {
      type: Schema.Types.ObjectId,
      refPath: 'Order',
      required: [true, 'order id is required'],
    },
    transactionId: { type: String, unique: true },
    amount: { type: Number, min: 0 },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.unpaid,
    },
    paymentIntentId: {
      type: String,
      default: null,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

const Payment = mongoose.model<TPayment, TPaymentModel>(
  'Payment',
  PaymentSchema,
)
export default Payment
