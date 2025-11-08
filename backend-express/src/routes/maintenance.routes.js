import express from 'express';
import { maintenanceController } from '../controllers/maintenance.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', maintenanceController.getAll);
router.get('/upcoming', maintenanceController.getUpcoming);
router.get('/:id', maintenanceController.getById);
router.post('/', authorize('ADMIN', 'SUPERVISOR'), maintenanceController.create);
router.put('/:id', authorize('ADMIN', 'SUPERVISOR'), maintenanceController.update);
router.delete('/:id', authorize('ADMIN'), maintenanceController.delete);

export default router;
