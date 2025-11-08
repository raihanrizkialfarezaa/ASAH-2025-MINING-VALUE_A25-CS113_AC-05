import express from 'express';
import { dashboardController } from '../controllers/dashboard.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/overview', dashboardController.getOverview);
router.get('/equipment-utilization', dashboardController.getEquipmentUtilization);
router.get('/delay-analysis', dashboardController.getDelayAnalysis);
router.get('/maintenance-overview', dashboardController.getMaintenanceOverview);

export default router;
