import express from 'express';
import { excavatorController } from '../controllers/excavator.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createExcavatorValidator,
  updateExcavatorValidator,
  updateExcavatorStatusValidator,
  getExcavatorByIdValidator,
  getExcavatorsQueryValidator,
} from '../validators/excavator.validator.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getExcavatorsQueryValidator, validate, excavatorController.getAll);
router.get('/:id', getExcavatorByIdValidator, validate, excavatorController.getById);
router.get(
  '/:id/performance',
  getExcavatorByIdValidator,
  validate,
  excavatorController.getPerformance
);
router.post(
  '/',
  authorize('ADMIN', 'SUPERVISOR'),
  createExcavatorValidator,
  validate,
  excavatorController.create
);
router.put(
  '/:id',
  authorize('ADMIN', 'SUPERVISOR'),
  updateExcavatorValidator,
  validate,
  excavatorController.update
);
router.patch(
  '/:id/status',
  authorize('ADMIN', 'SUPERVISOR', 'DISPATCHER'),
  updateExcavatorStatusValidator,
  validate,
  excavatorController.updateStatus
);
router.delete('/:id', authorize('ADMIN'), excavatorController.delete);

export default router;
