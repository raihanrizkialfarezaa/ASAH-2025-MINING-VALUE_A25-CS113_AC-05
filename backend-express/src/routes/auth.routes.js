import express from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { authLimiter } from '../middleware/rateLimit.middleware.js';
import {
  registerValidator,
  loginValidator,
  changePasswordValidator,
} from '../validators/auth.validator.js';

const router = express.Router();

router.post('/register', authLimiter, registerValidator, validate, authController.register);
router.post('/login', authLimiter, loginValidator, validate, authController.login);
router.get('/me', authenticate, authController.getProfile);
router.put(
  '/change-password',
  authenticate,
  changePasswordValidator,
  validate,
  authController.changePassword
);

export default router;
