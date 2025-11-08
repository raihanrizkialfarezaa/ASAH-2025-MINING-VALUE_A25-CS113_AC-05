import express from 'express';
import { operatorController } from '../controllers/operator.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createOperatorValidator,
  updateOperatorValidator,
  getOperatorByIdValidator,
  getOperatorsQueryValidator,
} from '../validators/operator.validator.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getOperatorsQueryValidator, validate, operatorController.getAll);
router.get('/:id', getOperatorByIdValidator, validate, operatorController.getById);
router.get(
  '/:id/performance',
  getOperatorByIdValidator,
  validate,
  operatorController.getPerformance
);
router.post(
  '/',
  authorize('ADMIN', 'SUPERVISOR'),
  createOperatorValidator,
  validate,
  operatorController.create
);
router.put(
  '/:id',
  authorize('ADMIN', 'SUPERVISOR'),
  updateOperatorValidator,
  validate,
  operatorController.update
);
router.delete('/:id', authorize('ADMIN'), operatorController.delete);

export default router;
