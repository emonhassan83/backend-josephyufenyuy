import { Router } from 'express'
import { PaymentController } from './payment.controller'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constant'

const router = Router()

router.post('/checkout', PaymentController.createPayment)

router.get('/confirm-payment', PaymentController.confirmPayment)

router.get('/', auth(USER_ROLE.admin), PaymentController.getAllPayments)

router.get('/:id', auth(USER_ROLE.admin), PaymentController.getAPayment)

router.patch('/refound-payment', PaymentController.refundPayment)

export const PaymentRoutes = router
