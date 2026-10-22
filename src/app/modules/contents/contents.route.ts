import { Router } from 'express';
import { contentsController } from './contents.controller';
import auth from '../../middleware/auth';
import zodValidationRequest from '../../middleware/validateRequest';
import { ContentsValidation } from './contents.validation';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.admin),
  zodValidationRequest(ContentsValidation.createValidationSchema),
  contentsController.createContents,
);

router.put(
  '/',
  auth(USER_ROLE.admin),
  zodValidationRequest(ContentsValidation.updateValidationSchema),
  contentsController.updateContents,
);

router.get('/:id', contentsController.getContentsById);

router.get('/', contentsController.getAllContents);

router.delete(
  '/:id',
  auth(USER_ROLE.admin),
  contentsController.deleteContents,
);

export const ContentsRoutes = router;
