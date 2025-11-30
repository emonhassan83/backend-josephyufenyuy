import express from 'express'
import zodValidationRequest from '../../middleware/validateRequest'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constant'
import { ServiceControllers } from './service.controller'
import { ServiceValidation } from './service.validation'
import parseData from '../../middleware/parseData'
import multer, { memoryStorage } from 'multer'

const router = express.Router()
const storage = memoryStorage()
const upload = multer({ storage })

router.post(
  '/',
  auth(USER_ROLE.admin),
  upload.fields([{ name: 'images', maxCount: 2 }]),
  parseData(),
  zodValidationRequest(ServiceValidation.createValidationSchema),
  ServiceControllers.insertIntoDB,
)

router.put(
  '/:id',
  auth(USER_ROLE.admin),
  upload.fields([{ name: 'images', maxCount: 2 }]),
  parseData(),
  zodValidationRequest(ServiceValidation.updateValidationSchema),
  ServiceControllers.updateIntoDB,
)

router.delete('/:id', auth(USER_ROLE.admin), ServiceControllers.deleteAIntoDB)

router.get('/', ServiceControllers.getAllIntoDB)

router.get('/:id', ServiceControllers.getAIntoDB)

export const ServiceRoutes = router
