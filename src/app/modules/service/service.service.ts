import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import QueryBuilder from '../../builder/QueryBuilder'
import { TService } from './service.interface'
import { Service } from './service.model'
import { UploadedFiles } from '../../interface/common.interface'
import { uploadManyToS3 } from '../../utils/s3'

const insertIntoDB = async (payload: TService, files: any) => {
  // file upload
  if (files) {
    const { images } = files as UploadedFiles

    if (images?.length) {
      const imgsArray: { file: any; path: string; key?: string }[] = []

      images.forEach((image) => {
        imgsArray.push({
          file: image,
          path: `images/service`,
        })
      })

      const uploadedImages = await uploadManyToS3(imgsArray)
      payload.images = uploadedImages.map(
        (img: { url: string; key: string }) => img.url,
      )
    }
  }

  const service = await Service.create(payload)
  if (!service) {
    throw new AppError(httpStatus.CONFLICT, 'Service not created!')
  }

  return service
}

const getAllIntoDB = async (query: Record<string, unknown>) => {
  const serviceQuery = new QueryBuilder(
    Service.find({ isDeleted: false }),
    query,
  )
    .search(['type'])
    .filter()
    .sort()
    .paginate()
    .fields()

  const result = await serviceQuery.modelQuery
  const meta = await serviceQuery.countTotal()
  if (!serviceQuery) {
    throw new AppError(httpStatus.NOT_FOUND, 'Service not found!')
  }

  return {
    meta,
    result,
  }
}

const getAIntoDB = async (id: string) => {
  const result = await Service.findById(id)
  if (!result || result?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Service not found')
  }

  return result
}

const updateIntoDB = async (
  id: string,
  payload: Partial<TService>,
  files: any,
) => {
  const service = await Service.findById(id)
  if (!service || service?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Service not found')
  }

  // file upload
  if (files) {
    const { images } = files as UploadedFiles

    if (images?.length) {
      const imgsArray: { file: any; path: string; key?: string }[] = []

      images.forEach((image) => {
        imgsArray.push({
          file: image,
          path: `images/service`,
        })
      })

      const uploadedImages = await uploadManyToS3(imgsArray)
      payload.images = uploadedImages.map(
        (img: { url: string; key: string }) => img.url,
      )
    }
  }

  const updateService = await Service.findByIdAndUpdate(id, payload, {
    new: true,
  })
  if (!updateService) {
    throw new AppError(httpStatus.NOT_FOUND, 'Service not updated')
  }

  return updateService
}

const deleteAIntoDB = async (id: string) => {
  const service = await Service.findById(id)
  if (!service || service?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Service not found')
  }

  const result = await Service.findByIdAndDelete(id)
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Service Delete failed')
  }

  return result
}

export const ServiceService = {
  insertIntoDB,
  getAllIntoDB,
  getAIntoDB,
  updateIntoDB,
  deleteAIntoDB,
}
