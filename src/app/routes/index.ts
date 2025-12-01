import { Router } from 'express'
import { UserRoutes } from '../modules/user/user.route'
import { otpRoutes } from '../modules/otp/otp.route'
import { AuthRoutes } from '../modules/auth/auth.route'
import { ContentsRoutes } from '../modules/contents/contents.route'
import { ServiceRoutes } from '../modules/service/service.route'
import { ServiceBookingRoutes } from '../modules/serviceBooking/serviceBooking.route'
import { InquireRoutes } from '../modules/inquire/inquire.route'
import { PaymentRoutes } from '../modules/payment/payment.route'

const router = Router()

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/otp',
    route: otpRoutes,
  },
  {
    path: '/contents',
    route: ContentsRoutes,
  },
  {
    path: '/services',
    route: ServiceRoutes,
  },
  {
    path: '/service-bookings',
    route: ServiceBookingRoutes,
  },
  {
    path: '/inquires',
    route: InquireRoutes,
  },
  {
    path: '/payments',
    route: PaymentRoutes,
  },
]

moduleRoutes.forEach((route) => router.use(route.path, route.route))

export default router
