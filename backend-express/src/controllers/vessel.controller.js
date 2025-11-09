import { vesselService } from '../services/vessel.service.js';
import catchAsync from '../utils/catchAsync.js';
import ApiResponse from '../utils/apiResponse.js';

export const vesselController = {
  getAll: catchAsync(async (req, res) => {
    const result = await vesselService.getAll(req.query);
    res.json(ApiResponse.paginated(result.vessels, result.pagination));
  }),

  getById: catchAsync(async (req, res) => {
    const vessel = await vesselService.getById(req.params.id);
    res.json(ApiResponse.success(vessel));
  }),

  create: catchAsync(async (req, res) => {
    const vessel = await vesselService.create(req.body);
    res.status(201).json(ApiResponse.created(vessel, 'Vessel created successfully'));
  }),

  update: catchAsync(async (req, res) => {
    const vessel = await vesselService.update(req.params.id, req.body);
    res.json(ApiResponse.success(vessel, 'Vessel updated successfully'));
  }),

  delete: catchAsync(async (req, res) => {
    const result = await vesselService.delete(req.params.id);
    res.json(ApiResponse.success(result));
  }),
};
