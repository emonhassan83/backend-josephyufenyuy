import Stripe from 'stripe'
import config from '../../config'
import { TPayment } from './payment.interface'
import httpStatus from 'http-status'
import Payment from './payment.models'
import AppError from '../../errors/AppError'
import QueryBuilder from '../../builder/QueryBuilder'
import { startSession } from 'mongoose'
import { PAYMENT_STATUS } from './payment.constants'
import {
  createCheckoutSession,
  generatePaymentEmailTemplate,
} from './payment.utils'
import { User } from '../user/user.model'
import { generateTransactionId } from '../../utils/generateTransctionId'
import { ServiceBooking } from '../serviceBooking/serviceBooking.model'
import { ORDER_STATUS } from '../serviceBooking/serviceBooking.constant'
import emailSender from '../../utils/emailSender'

const stripe = new Stripe(config.stripe?.stripe_api_secret as string, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
})

const initiatePayment = async (payload: TPayment) => {
  const transactionId = generateTransactionId()
  const { booking: bookingId } = payload

  // const user = await User.findById(userId)
  // if (!user || user?.isDeleted) {
  //   throw new AppError(httpStatus.NOT_FOUND, 'User not found!')
  // }

  // Determine model type and fetch associated data
  const booking = await ServiceBooking.findById(bookingId)
  if (!booking || booking?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found!')
  }

  // Always set the total amount
  payload.amount = booking.amount

  // Check for existing unpaid payment
  let paymentData = await Payment.findOne({
    booking: bookingId,
    isPaid: false,
    // user: userId,
  })

  if (paymentData) {
    paymentData = await Payment.findByIdAndUpdate(
      paymentData._id,
      { transactionId },
      { new: true },
    )
  } else {
    payload.transactionId = transactionId
    paymentData = await Payment.create(payload)
  }

  if (!paymentData) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to create payment',
    )
  }

  const checkoutSession = await createCheckoutSession({
    product: {
      amount: paymentData.amount,
      name: 'Booking Payment',
      quantity: 1,
    },
    customer: {
      name: booking.name,
      email: booking.email,
    },
    paymentId: paymentData._id,
  })

  return checkoutSession?.url
}

const confirmPayment = async (query: Record<string, any>) => {
  const { sessionId, paymentId } = query

  const session = await startSession()
  const PaymentSession = await stripe.checkout.sessions.retrieve(sessionId)
  const paymentIntentId = PaymentSession.payment_intent as string

  if (PaymentSession.status !== 'complete') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Payment session is not completed',
    )
  }

  try {
    session.startTransaction()

    // 1. Update Payment Record
    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        isPaid: true,
        status: PAYMENT_STATUS.paid,
        paymentIntentId,
      },
      { new: true, session },
    )

    if (!payment) throw new AppError(httpStatus.NOT_FOUND, 'Payment not found!')

    // 2. Update Order Status
    const booking = await ServiceBooking.findOneAndUpdate(
      { _id: payment.booking },
      {
        transactionId: payment.transactionId,
        paymentStatus: PAYMENT_STATUS.paid,
        status: ORDER_STATUS.processing,
      },
      { new: true, session },
    )
    if (!booking) {
      throw new AppError(httpStatus.NOT_FOUND, 'Booking not found!')
    }

    const user = await User.findById(payment.user)

    // 🚀 **Send 2 Emails After Successful Payment**
    if (user) {
      // Payment Confirmation email
      await emailSender(
        user.email,
        'Payment Confirmation – Thank You for Your Purchase',
        generatePaymentEmailTemplate(
          user.name,
          payment.amount,
          payment.transactionId,
        ),
      )
    }

    await session.commitTransaction()
    return payment
  } catch (error: any) {
    await session.abortTransaction()
    if (paymentIntentId) {
      try {
        await stripe.refunds.create({
          payment_intent: paymentIntentId,
        })
      } catch (refundError: any) {
        console.error('Error processing refund:', refundError.message)
      }
    }
    throw new AppError(httpStatus.BAD_GATEWAY, error.message)
  } finally {
    session.endSession()
  }
}

const getAllPaymentsFromDB = async (query: Record<string, any>) => {
  const reviewsModel = new QueryBuilder(
    Payment.find().populate([
      { path: 'booking' },
      // { path: 'user', select: 'name email photoUrl contactNumber' },
    ]),
    query,
  )
    .search([''])
    .filter()
    .paginate()
    .sort()
    .fields()

  const data = await reviewsModel.modelQuery
  const meta = await reviewsModel.countTotal()

  return {
    data,
    meta,
  }
}

const getAPaymentsFromDB = async (id: string) => {
  const payment = await Payment.findById(id).populate([
    { path: 'booking' },
    // { path: 'user', select: 'name email photoUrl contactNumber' },
  ])
  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Payment not found!')
  }

  return payment
}

const refundPayment = async (payload: any) => {}

export const paymentService = {
  initiatePayment,
  confirmPayment,
  getAllPaymentsFromDB,
  getAPaymentsFromDB,
  refundPayment,
}