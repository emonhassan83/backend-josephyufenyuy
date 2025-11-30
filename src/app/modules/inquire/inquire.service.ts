import AppError from '../../errors/AppError'
import emailSender from '../../utils/emailSender'
import { findAdmin } from '../../utils/findAdmin'
import { TInquire } from './inquire.interface'
import httpStatus from 'http-status'

const sendInquireEmail = async (payload: TInquire) => {
  const { name, email, subject, message } = payload

  const admin = await findAdmin()
  if (!admin) {
    throw new AppError(httpStatus.NOT_FOUND, 'Admin not found!')
  }

  // 2️⃣ Compose email content
  const emailBody = `
    <h2>New Inquiry Message</h2>
    <p><strong>From:</strong> ${name} (${email})</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
    <hr/>
    <p><em>Sent via GigConnect Inquiry Form</em></p>
  `

  // 3️⃣ Send Email
  await emailSender(
    admin.email,
    `New Inquiry: ${subject}`,
    emailBody,
  )

  return 
}

export const otpServices = {
  sendInquireEmail,
}
