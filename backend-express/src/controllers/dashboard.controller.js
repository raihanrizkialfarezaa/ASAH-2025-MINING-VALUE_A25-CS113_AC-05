import { dashboardService } from '../services/dashboard.service.js';
import catchAsync from '../utils/catchAsync.js';
import ApiResponse from '../utils/apiResponse.js';

export const dashboardController = {
  getOverview: catchAsync(async (req, res) => {
    const overview = await dashboardService.getOverview();
    res.json(ApiResponse.success(overview));
  }),

  getEquipmentUtilization: catchAsync(async (req, res) => {
    const { startDate, endDate } = req.query;
    const utilization = await dashboardService.getEquipmentUtilization(startDate, endDate);
    res.json(ApiResponse.success(utilization));
  }),

  getDelayAnalysis: catchAsync(async (req, res) => {
    const { startDate, endDate } = req.query;
    const analysis = await dashboardService.getDelayAnalysis(startDate, endDate);
    res.json(ApiResponse.success(analysis));
  }),

  getMaintenanceOverview: catchAsync(async (req, res) => {
    const overview = await dashboardService.getMaintenanceOverview();
    res.json(ApiResponse.success(overview));
  }),
};
