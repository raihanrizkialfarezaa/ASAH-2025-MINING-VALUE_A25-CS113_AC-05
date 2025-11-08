import express from 'express';
import {
  loadingPointController,
  dumpingPointController,
  roadSegmentController,
} from '../controllers/location.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/loading-points', loadingPointController.getAll);
router.get('/loading-points/:id', loadingPointController.getById);
router.post('/loading-points', authorize('ADMIN', 'SUPERVISOR'), loadingPointController.create);
router.put('/loading-points/:id', authorize('ADMIN', 'SUPERVISOR'), loadingPointController.update);
router.delete('/loading-points/:id', authorize('ADMIN'), loadingPointController.delete);

router.get('/dumping-points', dumpingPointController.getAll);
router.get('/dumping-points/:id', dumpingPointController.getById);
router.post('/dumping-points', authorize('ADMIN', 'SUPERVISOR'), dumpingPointController.create);
router.put('/dumping-points/:id', authorize('ADMIN', 'SUPERVISOR'), dumpingPointController.update);
router.delete('/dumping-points/:id', authorize('ADMIN'), dumpingPointController.delete);

router.get('/road-segments', roadSegmentController.getAll);
router.get('/road-segments/:id', roadSegmentController.getById);
router.post('/road-segments', authorize('ADMIN', 'SUPERVISOR'), roadSegmentController.create);
router.put('/road-segments/:id', authorize('ADMIN', 'SUPERVISOR'), roadSegmentController.update);
router.delete('/road-segments/:id', authorize('ADMIN'), roadSegmentController.delete);

export default router;
