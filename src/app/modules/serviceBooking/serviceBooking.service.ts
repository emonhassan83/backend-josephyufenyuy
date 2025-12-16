import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import QueryBuilder from '../../builder/QueryBuilder'
import { TServiceBooking } from './serviceBooking.interface'
import { ServiceBooking } from './serviceBooking.model'
import { Service } from '../service/service.model'
import { User } from '../user/user.model'
import { ORDER_STATUS, PAYMENT_STATUS } from './serviceBooking.constant'

const insertIntoDB = async (payload: TServiceBooking) => {
  const { service: serviceId } = payload

  // const user = await User.findById(userId)
  // if (!user || user?.isDeleted) {
  //   throw new AppError(httpStatus.NOT_FOUND, 'User not found!')
  // }

  const service = await Service.findById(serviceId)
  if (!service || service?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Service not found!')
  }

  // set service amount
  payload.amount = service.initialPrice

  const result = await ServiceBooking.create(payload)
  if (!result) {
    throw new AppError(httpStatus.CONFLICT, 'Service booking not created!')
  }

  return result
}

const getAllIntoDB = async (query: Record<string, unknown>) => {
  const serviceBookingQuery = new QueryBuilder(
    ServiceBooking.find({
      status: { $ne: ORDER_STATUS.pending },
      paymentStatus: PAYMENT_STATUS.paid,
      isDeleted: false,
    }).populate([
      // { path: 'user', select: 'name email photoUrl contactNumber' },
      { path: 'service', select: 'title' },
    ]),
    query,
  )
    .search(['name'])
    .filter()
    .sort()
    .paginate()
    .fields()

  const result = await serviceBookingQuery.modelQuery
  const meta = await serviceBookingQuery.countTotal()
  if (!serviceBookingQuery) {
    throw new AppError(httpStatus.NOT_FOUND, 'Service booking not found!')
  }

  return {
    meta,
    result,
  }
}

const getAIntoDB = async (id: string) => {
  const result = await ServiceBooking.findById(id).populate([
    // { path: 'user', select: 'name email photoUrl contactNumber' },
    { path: 'service' },
  ])
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Service booking not found')
  }

  return result
}

const updateIntoDB = async (id: string, payload: Partial<TServiceBooking>) => {
  const serviceBooking = await ServiceBooking.findById(id)
  if (!serviceBooking) {
    throw new AppError(httpStatus.NOT_FOUND, 'Service booking not found')
  }

  const updateService = await ServiceBooking.findByIdAndUpdate(id, payload, {
    new: true,
  })
  if (!updateService) {
    throw new AppError(httpStatus.NOT_FOUND, 'Service booking not updated')
  }

  return updateService
}

const deleteAIntoDB = async (id: string) => {
  const service = await ServiceBooking.findById(id)
  if (!service) {
    throw new AppError(httpStatus.NOT_FOUND, 'Service booking not found')
  }

  const result = await ServiceBooking.findByIdAndDelete(id)
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Service booking Delete failed')
  }

  return result
}

export const ServiceBookingService = {
  insertIntoDB,
  getAllIntoDB,
  getAIntoDB,
  updateIntoDB,
  deleteAIntoDB,
}
