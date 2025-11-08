import express from 'express';
import { weatherController } from '../controllers/weather.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', weatherController.getAll);
router.get('/latest', weatherController.getLatest);
router.get('/:id', weatherController.getById);
router.post('/', authorize('ADMIN', 'SUPERVISOR', 'DISPATCHER'), weatherController.create);
router.put('/:id', authorize('ADMIN', 'SUPERVISOR'), weatherController.update);
router.delete('/:id', authorize('ADMIN'), weatherController.delete);

export default router;
