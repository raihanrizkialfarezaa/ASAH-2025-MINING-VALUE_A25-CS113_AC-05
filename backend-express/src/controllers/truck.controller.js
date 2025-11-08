import { truckService } from '../services/truck.service.js';
import catchAsync from '../utils/catchAsync.js';
import ApiResponse from '../utils/apiResponse.js';

export const truckController = {
  getAll: catchAsync(async (req, res) => {
    const result = await truckService.getAll(req.query);
    res.json(ApiResponse.paginated(result.trucks, result.pagination));
  }),

  getById: catchAsync(async (req, res) => {
    const truck = await truckService.getById(req.params.id);
    res.json(ApiResponse.success(truck));
  }),

  create: catchAsync(async (req, res) => {
    const truck = await truckService.create(req.body);
    res.status(201).json(ApiResponse.created(truck, 'Truck created successfully'));
  }),

  update: catchAsync(async (req, res) => {
    const truck = await truckService.update(req.params.id, req.body);
    res.json(ApiResponse.success(truck, 'Truck updated successfully'));
  }),

  delete: catchAsync(async (req, res) => {
    const result = await truckService.delete(req.params.id);
    res.json(ApiResponse.success(result));
  }),

  updateStatus: catchAsync(async (req, res) => {
    const { status, location, reason } = req.body;
    const truck = await truckService.updateStatus(req.params.id, status, location, reason);
    res.json(ApiResponse.success(truck, 'Truck status updated successfully'));
  }),

  getByStatus: catchAsync(async (req, res) => {
    const trucks = await truckService.getByStatus(req.params.status);
    res.json(ApiResponse.success(trucks));
  }),

  getPerformance: catchAsync(async (req, res) => {
    const { startDate, endDate } = req.query;
    const performance = await truckService.getPerformance(req.params.id, startDate, endDate);
    res.json(ApiResponse.success(performance));
  }),

  assignOperator: catchAsync(async (req, res) => {
    const { operatorId } = req.body;
    const truck = await truckService.assignOperator(req.params.id, operatorId);
    res.json(ApiResponse.success(truck, 'Operator assigned successfully'));
  }),
};
