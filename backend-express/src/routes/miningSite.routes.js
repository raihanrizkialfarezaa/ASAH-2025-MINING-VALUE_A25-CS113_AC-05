import express from 'express';
import { miningSiteController } from '../controllers/miningSite.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', miningSiteController.getAll);
router.get('/:id', miningSiteController.getById);
router.post('/', authorize('ADMIN', 'SUPERVISOR'), miningSiteController.create);
router.put('/:id', authorize('ADMIN', 'SUPERVISOR'), miningSiteController.update);
router.delete('/:id', authorize('ADMIN'), miningSiteController.delete);

export default router;
