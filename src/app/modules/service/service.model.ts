import { Schema, model } from 'mongoose'
import { TService, TServiceModel } from './service.interface'

const serviceInfoSchema = new Schema(
  {
    title: { type: String, required: true },
    subTitle: { type: String, required: true },
  },
  { _id: false },
)

const serviceSchema = new Schema<TService>(
  {
    title: { type: String, required: true },
    subTitle: { type: String, required: true },
    description: { type: String, required: true },
    initialPrice: { type: Number, required: true },
    finalPrice: { type: Number, required: true },
    images: { type: [String], required: true },
    info: { type: [serviceInfoSchema], required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
)

export const Service = model<TService, TServiceModel>('Service', serviceSchema)
