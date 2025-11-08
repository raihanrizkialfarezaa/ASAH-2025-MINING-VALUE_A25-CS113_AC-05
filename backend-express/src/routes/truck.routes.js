import express from 'express';
import { truckController } from '../controllers/truck.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createTruckValidator,
  updateTruckValidator,
  updateTruckStatusValidator,
  getTruckByIdValidator,
  getTrucksQueryValidator,
} from '../validators/truck.validator.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getTrucksQueryValidator, validate, truckController.getAll);
router.get('/status/:status', truckController.getByStatus);
router.get('/:id', getTruckByIdValidator, validate, truckController.getById);
router.get('/:id/performance', getTruckByIdValidator, validate, truckController.getPerformance);
router.post(
  '/',
  authorize('ADMIN', 'SUPERVISOR'),
  createTruckValidator,
  validate,
  truckController.create
);
router.put(
  '/:id',
  authorize('ADMIN', 'SUPERVISOR'),
  updateTruckValidator,
  validate,
  truckController.update
);
router.patch(
  '/:id/status',
  authorize('ADMIN', 'SUPERVISOR', 'DISPATCHER'),
  updateTruckStatusValidator,
  validate,
  truckController.updateStatus
);
router.post(
  '/:id/assign-operator',
  authorize('ADMIN', 'SUPERVISOR', 'DISPATCHER'),
  truckController.assignOperator
);
router.delete('/:id', authorize('ADMIN'), truckController.delete);

export default router;
