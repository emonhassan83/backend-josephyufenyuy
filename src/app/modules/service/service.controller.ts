import catchAsync from '../../utils/catchAsync'
import httpStatus from 'http-status'
import sendResponse from '../../utils/sendResponse'
import { ServiceService } from './service.service'

const insertIntoDB = catchAsync(async (req, res) => {
  const result = await ServiceService.insertIntoDB(req.body, req.files)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Service create successfully!',
    data: result,
  })
})

const getAllIntoDB = catchAsync(async (req, res) => {
  const result = await ServiceService.getAllIntoDB(req.query)

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Services retrieved successfully!',
    meta: result.meta,
    data: result.result,
  })
})

const getAIntoDB = catchAsync(async (req, res) => {
  const result = await ServiceService.getAIntoDB(req.params.id as string)

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Service retrieved successfully!',
    data: result,
  })
})

const updateIntoDB = catchAsync(async (req, res) => {
  const result = await ServiceService.updateIntoDB(
    req.params.id as string,
    req.body,
    req.files,
  )

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Service update successfully!',
    data: result,
  })
})

const deleteAIntoDB = catchAsync(async (req, res) => {
  const result = await ServiceService.deleteAIntoDB(req.params.id as string)

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Service delete successfully!',
    data: result,
  })
})

export const ServiceControllers = {
  insertIntoDB,
  getAllIntoDB,
  getAIntoDB,
  updateIntoDB,
  deleteAIntoDB,
}
