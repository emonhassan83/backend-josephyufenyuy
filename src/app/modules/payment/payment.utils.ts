import Stripe from 'stripe'
import config from '../../config'

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

export const generatePaymentEmailTemplate = (
  name: string,
  amount: number,
  transactionId: string
) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Payment Confirmation</h2>
      <p>Dear ${name},</p>
      <p>Thank you for your payment. We're pleased to confirm that your transaction has been successfully processed.</p>

      <p><strong>Amount Paid:</strong> $${amount}</p>
      <p><strong>Transaction ID:</strong> ${transactionId}</p>

      <p>You will receive updates regarding your booking as we move into the next steps.</p>
      <p>Warm regards,<br/>Customer Support Team</p>
    </div>
  `;
};
