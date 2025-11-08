import express from 'express';
import { productionController } from '../controllers/production.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', productionController.getAll);
router.get('/statistics', productionController.getStatistics);
router.get('/:id', productionController.getById);
router.post('/', authorize('ADMIN', 'SUPERVISOR', 'DISPATCHER'), productionController.create);
router.put('/:id', authorize('ADMIN', 'SUPERVISOR'), productionController.update);
router.delete('/:id', authorize('ADMIN'), productionController.delete);

export default router;
