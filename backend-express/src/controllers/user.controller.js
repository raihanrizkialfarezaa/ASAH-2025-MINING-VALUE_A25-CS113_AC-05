import { userService } from '../services/user.service.js';
import catchAsync from '../utils/catchAsync.js';
import ApiResponse from '../utils/apiResponse.js';

export const userController = {
  getAll: catchAsync(async (req, res) => {
    const result = await userService.getAll(req.query);
    res.json(ApiResponse.paginated(result.users, result.pagination));
  }),

  getById: catchAsync(async (req, res) => {
    const user = await userService.getById(req.params.id);
    res.json(ApiResponse.success(user));
  }),

  create: catchAsync(async (req, res) => {
    const user = await userService.create(req.body);
    res.status(201).json(ApiResponse.created(user, 'User created successfully'));
  }),

  update: catchAsync(async (req, res) => {
    const user = await userService.update(req.params.id, req.body);
    res.json(ApiResponse.success(user, 'User updated successfully'));
  }),

  delete: catchAsync(async (req, res) => {
    const result = await userService.delete(req.params.id);
    res.json(ApiResponse.success(result));
  }),

  activate: catchAsync(async (req, res) => {
    const result = await userService.activate(req.params.id);
    res.json(ApiResponse.success(result));
  }),
};
