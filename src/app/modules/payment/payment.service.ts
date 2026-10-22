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

const confirmPayment = async (query: Record<string, unknown>) => {
  const { sessionId } = query
  if (typeof sessionId !== 'string' || !sessionId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid payment session')
  }

  const PaymentSession = await stripe.checkout.sessions.retrieve(sessionId)
  if (
    PaymentSession.status !== 'complete' ||
    PaymentSession.payment_status !== 'paid' ||
    PaymentSession.mode !== 'payment'
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Payment session is not a completed payment',
    )
  }

  const paymentId = PaymentSession.metadata?.paymentId
  const paymentIntentId =
    typeof PaymentSession.payment_intent === 'string'
      ? PaymentSession.payment_intent
      : PaymentSession.payment_intent?.id

  if (!paymentId || !paymentIntentId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid payment session')
  }

  const payment = await Payment.findById(paymentId)
  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Payment not found!')
  }

  if (
    PaymentSession.amount_total !== Math.round(payment.amount * 100) ||
    PaymentSession.currency !== 'usd'
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Payment session does not match the payment amount',
    )
  }

  if (payment.isPaid) {
    if (payment.paymentIntentId === paymentIntentId) return payment
    throw new AppError(
      httpStatus.CONFLICT,
      'Payment has already been processed',
    )
  }

  const session = await startSession()
  try {
    session.startTransaction()

    const updatedPayment = await Payment.findOneAndUpdate(
      { _id: paymentId, isPaid: false },
      {
        isPaid: true,
        status: PAYMENT_STATUS.paid,
        paymentIntentId,
      },
      { new: true, session },
    )

    if (!updatedPayment) {
      throw new AppError(
        httpStatus.CONFLICT,
        'Payment has already been processed',
      )
    }

    const booking = await ServiceBooking.findOneAndUpdate(
      { _id: updatedPayment.booking },
      {
        transactionId: updatedPayment.transactionId,
        paymentStatus: PAYMENT_STATUS.paid,
        status: ORDER_STATUS.processing,
      },
      { new: true, session },
    )
    if (!booking) {
      throw new AppError(httpStatus.NOT_FOUND, 'Booking not found!')
    }

    const user = await User.findById(updatedPayment.user)

    if (user) {
      await emailSender(
        user.email,
        'Payment Confirmation – Thank You for Your Purchase',
        generatePaymentEmailTemplate(
          user.name,
          updatedPayment.amount,
          updatedPayment.transactionId,
        ),
      )
    }

    await session.commitTransaction()
    return updatedPayment
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    await session.endSession()
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