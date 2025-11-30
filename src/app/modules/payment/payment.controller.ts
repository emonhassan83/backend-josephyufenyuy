import catchAsync from '../../utils/catchAsync'
import { Request, Response } from 'express'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'
import { paymentService } from './payment.service'
import config from '../../config'

const createPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentService.initiatePayment(req.body)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'payment initiate successfully',
  })
})

const confirmPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentService.confirmPayment(req.query)

  //  res.redirect(
  //   `${config.payment_success_url}`,
  // )
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'payment initiate successfully',
  })
})

const getAllPayments = catchAsync(async (req, res) => {
  const result = await paymentService.getAllPaymentsFromDB(req.query)

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Payments retrieved successfully!',
    meta: result.meta,
    data: result.data,
  })
})

const getAPayment = catchAsync(async (req, res) => {
  const result = await paymentService.getAPaymentsFromDB(req.params.id)

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Payment retrieved successfully!',
    data: result,
  })
})

const refundPayment = catchAsync(async (req, res) => {
  const result = await paymentService.refundPayment(req.body)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payment refund successfully!',
    data: result,
  })
})

export const PaymentController = {
  createPayment,
  confirmPayment,
  getAllPayments,
  getAPayment,
  refundPayment,
}
