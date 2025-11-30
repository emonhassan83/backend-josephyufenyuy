import { Model } from 'mongoose'

export type TServiceInfo = {
  title: string
  subTitle: string
}

export type TService = {
  title: string
  subTitle: string
  description: string
  images: string[]
  initialPrice: number
  finalPrice: number
  info: TServiceInfo[]
  isDeleted: boolean
}

export type TServiceModel = Model<TService, Record<string, unknown>>
