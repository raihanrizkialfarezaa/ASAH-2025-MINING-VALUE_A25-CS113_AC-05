import { authService } from '../services/auth.service.js';
import catchAsync from '../utils/catchAsync.js';
import ApiResponse from '../utils/apiResponse.js';

export const authController = {
  register: catchAsync(async (req, res) => {
    const user = await authService.register(req.body);
    res.status(201).json(ApiResponse.created(user, 'User registered successfully'));
  }),

  login: catchAsync(async (req, res) => {
    const { username, password } = req.body;
    const result = await authService.login(username, password);
    res.json(ApiResponse.success(result, 'Login successful'));
  }),

  getProfile: catchAsync(async (req, res) => {
    const user = await authService.getProfile(req.user.id);
    res.json(ApiResponse.success(user));
  }),

  changePassword: catchAsync(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const result = await authService.changePassword(req.user.id, currentPassword, newPassword);
    res.json(ApiResponse.success(result));
  }),
};
