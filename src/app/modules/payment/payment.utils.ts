import Stripe from 'stripe'
import config from '../../config'
import { TPayment } from './payment.interface'
import { findAdmin } from '../../utils/findAdmin'
import { messages } from '../notification/notification.constant'
import { NotificationService } from '../notification/notification.service'
import { modeType } from '../notification/notification.interface'

const stripe: Stripe = new Stripe(config.stripe?.stripe_api_secret as string, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
})
interface TPayload {
  product: {
    amount: number
    name: string
    quantity: number
  }
  // customerId: string;
  paymentId: string
}

export const createCheckoutSession = async (payload: TPayload) => {
  const paymentGatewayData = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: payload?.product?.name,
          },
          unit_amount: Math.round(payload.product?.amount * 100),
        },
        quantity: payload.product?.quantity,
      },
    ],

    success_url: `${config.server_url}/payments/confirm-payment?sessionId={CHECKOUT_SESSION_ID}&paymentId=${payload?.paymentId}`,
    cancel_url: config?.payment_cancel_url,
    mode: 'payment',
    invoice_creation: {
      enabled: true,
    },
    payment_method_types: ['card'],
  })

  return paymentGatewayData
}


export const paymentNotifyToAdmin = async (
  type: 'SUCCESS' | 'REFUND',
  payment: TPayment,
) => {
  const admin = await findAdmin()

  // Define message and description based on type
  const message =
    type === 'SUCCESS'
      ? messages.paymentManagement.paymentSuccess
      : messages.paymentManagement.paymentRefunded

  const description =
    type === 'SUCCESS'
      ? `A payment of $${payment.amount} has been successfully received. Transaction ID: ${payment.transactionId}.`
      : `A refund of $${payment.amount} has been successfully processed. Refund Transaction ID: ${payment.transactionId}.`

  // Create a notification entry
  await NotificationService.createNotificationIntoDB({
    receiver: admin?._id,
    message,
    description,
    reference: payment.order,
    model_type: modeType.Payment,
  })
}

export const paymentNotifyToUser = async (
  type: 'SUCCESS' | 'REFUND',
  payment: TPayment,
) => {
  // Define message and description based on type
  const message =
    type === 'SUCCESS'
      ? messages.paymentManagement.paymentSuccess
      : messages.paymentManagement.paymentRefunded

  const description =
    type === 'SUCCESS'
      ? `Your payment of $${payment.amount} has been successfully processed. Transaction ID: ${payment.transactionId}.`
      : `A refund of $${payment.amount} has been issued to your account. Refund Transaction ID: ${payment.transactionId}.`

  // Create a notification entry
  await NotificationService.createNotificationIntoDB({
    receiver: payment?.user,
    message,
    description,
    reference: payment.order,
    model_type: modeType.Payment,
  })
}
