import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import { otpServices } from './inquire.service'
import sendResponse from '../../utils/sendResponse'
import { Request, Response } from 'express'

const sentEmail = catchAsync(async (req: Request, res: Response) => {
  const result = await otpServices.sendInquireEmail(req.body)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Inquire email sent successfully',
    data: result,
  })
})

export const InquireControllers = {
  sentEmail,
}
