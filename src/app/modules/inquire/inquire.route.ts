import { Router } from 'express';
import { InquireControllers } from './inquire.controller';
import validateRequest from '../../middleware/validateRequest';
import { InquireValidations } from './inquire.validation';
const router = Router();

router.post(
  '/sent-mail',
  validateRequest(InquireValidations.sentEmailSchema),
  InquireControllers.sentEmail,
);

export const InquireRoutes = router;