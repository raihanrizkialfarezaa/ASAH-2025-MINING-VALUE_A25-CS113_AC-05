import { haulingService } from '../services/hauling.service.js';
import catchAsync from '../utils/catchAsync.js';
import ApiResponse from '../utils/apiResponse.js';

export const haulingController = {
  getAll: catchAsync(async (req, res) => {
    const result = await haulingService.getAll(req.query);
    res.json(ApiResponse.paginated(result.activities, result.pagination));
  }),

  getById: catchAsync(async (req, res) => {
    const activity = await haulingService.getById(req.params.id);
    res.json(ApiResponse.success(activity));
  }),

  create: catchAsync(async (req, res) => {
    const activity = await haulingService.create(req.body, req.user.id);
    res.status(201).json(ApiResponse.created(activity, 'Hauling activity created successfully'));
  }),

  completeLoading: catchAsync(async (req, res) => {
    const { loadWeight, loadingDuration } = req.body;
    const activity = await haulingService.completeLoading(
      req.params.id,
      loadWeight,
      loadingDuration
    );
    res.json(ApiResponse.success(activity, 'Loading completed successfully'));
  }),

  completeDumping: catchAsync(async (req, res) => {
    const { dumpingDuration } = req.body;
    const activity = await haulingService.completeDumping(req.params.id, dumpingDuration);
    res.json(ApiResponse.success(activity, 'Dumping completed successfully'));
  }),

  complete: catchAsync(async (req, res) => {
    const { returnTime } = req.body;
    const activity = await haulingService.complete(req.params.id, returnTime);
    res.json(ApiResponse.success(activity, 'Hauling activity completed successfully'));
  }),

  cancel: catchAsync(async (req, res) => {
    const { reason } = req.body;
    const activity = await haulingService.cancel(req.params.id, reason);
    res.json(ApiResponse.success(activity, 'Hauling activity cancelled successfully'));
  }),

  addDelay: catchAsync(async (req, res) => {
    const activity = await haulingService.addDelay(req.params.id, req.body);
    res.json(ApiResponse.success(activity, 'Delay added successfully'));
  }),

  getStatistics: catchAsync(async (req, res) => {
    const statistics = await haulingService.getStatistics(req.query);
    res.json(ApiResponse.success(statistics));
  }),

  getActive: catchAsync(async (req, res) => {
    const activities = await haulingService.getActive();
    res.json(ApiResponse.success(activities));
  }),
};
