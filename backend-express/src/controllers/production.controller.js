import { productionService } from '../services/production.service.js';
import catchAsync from '../utils/catchAsync.js';
import ApiResponse from '../utils/apiResponse.js';

export const productionController = {
  getAll: catchAsync(async (req, res) => {
    const result = await productionService.getAll(req.query);
    res.json(ApiResponse.paginated(result.records, result.pagination));
  }),

  getById: catchAsync(async (req, res) => {
    const record = await productionService.getById(req.params.id);
    res.json(ApiResponse.success(record));
  }),

  create: catchAsync(async (req, res) => {
    const record = await productionService.create(req.body);
    res.status(201).json(ApiResponse.created(record, 'Production record created successfully'));
  }),

  update: catchAsync(async (req, res) => {
    const record = await productionService.update(req.params.id, req.body);
    res.json(ApiResponse.success(record, 'Production record updated successfully'));
  }),

  delete: catchAsync(async (req, res) => {
    const result = await productionService.delete(req.params.id);
    res.json(ApiResponse.success(result));
  }),

  getStatistics: catchAsync(async (req, res) => {
    const { miningSiteId, startDate, endDate } = req.query;
    const statistics = await productionService.getStatistics(miningSiteId, startDate, endDate);
    res.json(ApiResponse.success(statistics));
  }),
};
