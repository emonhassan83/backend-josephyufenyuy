import catchAsync from '../../utils/catchAsync'
import httpStatus from 'http-status'
import sendResponse from '../../utils/sendResponse'
import { ServiceBookingService } from './serviceBooking.service'

const insertIntoDB = catchAsync(async (req, res) => {
  const result = await ServiceBookingService.insertIntoDB(req.body)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Service booking successfully!',
    data: result,
  })
})

const getAllIntoDB = catchAsync(async (req, res) => {
  const result = await ServiceBookingService.getAllIntoDB(req.query)

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Services bookings retrieved successfully!',
    meta: result.meta,
    data: result.result,
  })
})

const getMyBookingsIntoDB = catchAsync(async (req, res) => {
  req.query['user'] = req.user?._id
  const result = await ServiceBookingService.getAllIntoDB(req.query)

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'My bookings retrieved successfully!',
    meta: result.meta,
    data: result.result,
  })
})

const getAIntoDB = catchAsync(async (req, res) => {
  const result = await ServiceBookingService.getAIntoDB(req.params.id as string)

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Service booking retrieved successfully!',
    data: result,
  })
})

const updateIntoDB = catchAsync(async (req, res) => {
  const result = await ServiceBookingService.updateIntoDB(
    req.params.id as string,
    req.body
  )

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Service booking update successfully!',
    data: result,
  })
})

const deleteAIntoDB = catchAsync(async (req, res) => {
  const result = await ServiceBookingService.deleteAIntoDB(req.params.id as string)

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Service booking delete successfully!',
    data: result,
  })
})

export const ServiceBookingControllers = {
  insertIntoDB,
  getAllIntoDB,
  getMyBookingsIntoDB,
  getAIntoDB,
  updateIntoDB,
  deleteAIntoDB,
}
