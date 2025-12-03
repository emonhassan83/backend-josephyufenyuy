import express from 'express'
import zodValidationRequest from '../../middleware/validateRequest'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constant'
import { ServiceBookingControllers } from './serviceBooking.controller'
import { ServiceBookingValidation } from './serviceBooking.validation'

const router = express.Router()

router.post(
  '/',
  // auth(USER_ROLE.user),
  zodValidationRequest(ServiceBookingValidation.createValidationSchema),
  ServiceBookingControllers.insertIntoDB,
)

router.put(
  '/:id',
  auth(USER_ROLE.admin),
  zodValidationRequest(ServiceBookingValidation.updateValidationSchema),
  ServiceBookingControllers.updateIntoDB,
)

router.delete(
  '/:id',
  auth(USER_ROLE.admin),
  ServiceBookingControllers.deleteAIntoDB,
)

router.get(
  '/my-bookings',
  auth(USER_ROLE.user),
  ServiceBookingControllers.getMyBookingsIntoDB,
)

router.get(
  '/',
  auth(USER_ROLE.admin),
  ServiceBookingControllers.getAllIntoDB,
)

router.get('/:id', auth(USER_ROLE.admin), ServiceBookingControllers.getAIntoDB)

export const ServiceBookingRoutes = router
