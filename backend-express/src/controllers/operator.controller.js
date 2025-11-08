import { operatorService } from '../services/operator.service.js';
import catchAsync from '../utils/catchAsync.js';
import ApiResponse from '../utils/apiResponse.js';

export const operatorController = {
  getAll: catchAsync(async (req, res) => {
    const result = await operatorService.getAll(req.query);
    res.json(ApiResponse.paginated(result.operators, result.pagination));
  }),

  getById: catchAsync(async (req, res) => {
    const operator = await operatorService.getById(req.params.id);
    res.json(ApiResponse.success(operator));
  }),

  create: catchAsync(async (req, res) => {
    const operator = await operatorService.create(req.body);
    res.status(201).json(ApiResponse.created(operator, 'Operator created successfully'));
  }),

  update: catchAsync(async (req, res) => {
    const operator = await operatorService.update(req.params.id, req.body);
    res.json(ApiResponse.success(operator, 'Operator updated successfully'));
  }),

  delete: catchAsync(async (req, res) => {
    const result = await operatorService.delete(req.params.id);
    res.json(ApiResponse.success(result));
  }),

  getPerformance: catchAsync(async (req, res) => {
    const { startDate, endDate } = req.query;
    const performance = await operatorService.getPerformance(req.params.id, startDate, endDate);
    res.json(ApiResponse.success(performance));
  }),
};
