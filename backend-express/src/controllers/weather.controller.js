import { weatherService } from '../services/weather.service.js';
import catchAsync from '../utils/catchAsync.js';
import ApiResponse from '../utils/apiResponse.js';

export const weatherController = {
  getAll: catchAsync(async (req, res) => {
    const result = await weatherService.getAll(req.query);
    res.json(ApiResponse.paginated(result.logs, result.pagination));
  }),

  getById: catchAsync(async (req, res) => {
    const log = await weatherService.getById(req.params.id);
    res.json(ApiResponse.success(log));
  }),

  create: catchAsync(async (req, res) => {
    const log = await weatherService.create(req.body);
    res.status(201).json(ApiResponse.created(log, 'Weather log created successfully'));
  }),

  update: catchAsync(async (req, res) => {
    const log = await weatherService.update(req.params.id, req.body);
    res.json(ApiResponse.success(log, 'Weather log updated successfully'));
  }),

  delete: catchAsync(async (req, res) => {
    const result = await weatherService.delete(req.params.id);
    res.json(ApiResponse.success(result));
  }),

  getLatest: catchAsync(async (req, res) => {
    const { miningSiteId } = req.query;
    const log = await weatherService.getLatest(miningSiteId);
    res.json(ApiResponse.success(log));
  }),
};
