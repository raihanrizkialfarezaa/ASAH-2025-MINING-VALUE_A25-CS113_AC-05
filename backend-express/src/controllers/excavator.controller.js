import { excavatorService } from '../services/excavator.service.js';
import catchAsync from '../utils/catchAsync.js';
import ApiResponse from '../utils/apiResponse.js';

export const excavatorController = {
  getAll: catchAsync(async (req, res) => {
    const result = await excavatorService.getAll(req.query);
    res.json(ApiResponse.paginated(result.excavators, result.pagination));
  }),

  getById: catchAsync(async (req, res) => {
    const excavator = await excavatorService.getById(req.params.id);
    res.json(ApiResponse.success(excavator));
  }),

  create: catchAsync(async (req, res) => {
    const excavator = await excavatorService.create(req.body);
    res.status(201).json(ApiResponse.created(excavator, 'Excavator created successfully'));
  }),

  update: catchAsync(async (req, res) => {
    const excavator = await excavatorService.update(req.params.id, req.body);
    res.json(ApiResponse.success(excavator, 'Excavator updated successfully'));
  }),

  delete: catchAsync(async (req, res) => {
    const result = await excavatorService.delete(req.params.id);
    res.json(ApiResponse.success(result));
  }),

  updateStatus: catchAsync(async (req, res) => {
    const { status, location, reason } = req.body;
    const excavator = await excavatorService.updateStatus(req.params.id, status, location, reason);
    res.json(ApiResponse.success(excavator, 'Excavator status updated successfully'));
  }),

  getPerformance: catchAsync(async (req, res) => {
    const { startDate, endDate } = req.query;
    const performance = await excavatorService.getPerformance(req.params.id, startDate, endDate);
    res.json(ApiResponse.success(performance));
  }),
};
