import { miningSiteService } from '../services/miningSite.service.js';
import catchAsync from '../utils/catchAsync.js';
import ApiResponse from '../utils/apiResponse.js';

export const miningSiteController = {
  getAll: catchAsync(async (req, res) => {
    const result = await miningSiteService.getAll(req.query);
    res.json(ApiResponse.paginated(result.sites, result.pagination));
  }),

  getById: catchAsync(async (req, res) => {
    const site = await miningSiteService.getById(req.params.id);
    res.json(ApiResponse.success(site));
  }),

  create: catchAsync(async (req, res) => {
    const site = await miningSiteService.create(req.body);
    res.status(201).json(ApiResponse.created(site, 'Mining site created successfully'));
  }),

  update: catchAsync(async (req, res) => {
    const site = await miningSiteService.update(req.params.id, req.body);
    res.json(ApiResponse.success(site, 'Mining site updated successfully'));
  }),

  delete: catchAsync(async (req, res) => {
    const result = await miningSiteService.delete(req.params.id);
    res.json(ApiResponse.success(result));
  }),
};
