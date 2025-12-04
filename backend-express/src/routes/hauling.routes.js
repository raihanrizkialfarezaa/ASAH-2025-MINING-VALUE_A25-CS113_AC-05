import express from 'express';
import { haulingController } from '../controllers/hauling.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createHaulingValidator,
  updateHaulingValidator,
  completeLoadingValidator,
  completeDumpingValidator,
  addDelayValidator,
  getHaulingsQueryValidator,
} from '../validators/hauling.validator.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getHaulingsQueryValidator, validate, haulingController.getAll);
router.get('/active', haulingController.getActive);
router.get('/statistics', haulingController.getStatistics);
router.get('/:id', haulingController.getById);
router.post(
  '/',
  authorize('SUPERVISOR', 'DISPATCHER'),
  createHaulingValidator,
  validate,
  haulingController.create
);
router.put(
  '/:id',
  authorize('SUPERVISOR', 'DISPATCHER', 'ADMIN'),
  updateHaulingValidator,
  validate,
  haulingController.update
);
router.patch(
  '/:id/complete-loading',
  authorize('SUPERVISOR', 'DISPATCHER', 'OPERATOR'),
  completeLoadingValidator,
  validate,
  haulingController.completeLoading
);
router.patch(
  '/:id/complete-dumping',
  authorize('SUPERVISOR', 'DISPATCHER', 'OPERATOR'),
  completeDumpingValidator,
  validate,
  haulingController.completeDumping
);
router.patch(
  '/:id/complete',
  authorize('SUPERVISOR', 'DISPATCHER', 'OPERATOR'),
  haulingController.complete
);
router.patch('/:id/cancel', authorize('SUPERVISOR', 'ADMIN'), haulingController.cancel);
router.post(
  '/:id/delay',
  authorize('SUPERVISOR', 'DISPATCHER'),
  addDelayValidator,
  validate,
  haulingController.addDelay
);

export default router;
