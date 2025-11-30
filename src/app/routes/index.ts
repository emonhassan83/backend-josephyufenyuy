import { Router } from 'express'
import { UserRoutes } from '../modules/user/user.route'
import { otpRoutes } from '../modules/otp/otp.route'
import { AuthRoutes } from '../modules/auth/auth.route'

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
  }
]

moduleRoutes.forEach((route) => router.use(route.path, route.route))

export default router
