import express from 'express';
import { userController } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { registerValidator, updateUserValidator } from '../validators/auth.validator.js';

const router = express.Router();

router.use(authenticate);

router.get('/', authorize('ADMIN', 'SUPERVISOR'), userController.getAll);
router.get('/:id', authorize('ADMIN', 'SUPERVISOR'), userController.getById);
router.post('/', authorize('ADMIN'), registerValidator, validate, userController.create);
router.put('/:id', authorize('ADMIN'), updateUserValidator, validate, userController.update);
router.delete('/:id', authorize('ADMIN'), userController.delete);
router.patch('/:id/activate', authorize('ADMIN'), userController.activate);

export default router;
