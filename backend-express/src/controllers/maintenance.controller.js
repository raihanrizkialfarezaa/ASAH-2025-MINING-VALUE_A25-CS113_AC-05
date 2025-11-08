import { maintenanceService } from '../services/maintenance.service.js';
import catchAsync from '../utils/catchAsync.js';
import ApiResponse from '../utils/apiResponse.js';

export const maintenanceController = {
  getAll: catchAsync(async (req, res) => {
    const result = await maintenanceService.getAll(req.query);
    res.json(ApiResponse.paginated(result.logs, result.pagination));
  }),

  getById: catchAsync(async (req, res) => {
    const log = await maintenanceService.getById(req.params.id);
    res.json(ApiResponse.success(log));
  }),

  create: catchAsync(async (req, res) => {
    const log = await maintenanceService.create(req.body);
    res.status(201).json(ApiResponse.created(log, 'Maintenance log created successfully'));
  }),

  update: catchAsync(async (req, res) => {
    const log = await maintenanceService.update(req.params.id, req.body);
    res.json(ApiResponse.success(log, 'Maintenance log updated successfully'));
  }),

  delete: catchAsync(async (req, res) => {
    const result = await maintenanceService.delete(req.params.id);
    res.json(ApiResponse.success(result));
  }),

  getUpcoming: catchAsync(async (req, res) => {
    const { days } = req.query;
    const logs = await maintenanceService.getUpcoming(days ? parseInt(days) : 7);
    res.json(ApiResponse.success(logs));
  }),
};
