import {
  loadingPointService,
  dumpingPointService,
  roadSegmentService,
} from '../services/location.service.js';
import catchAsync from '../utils/catchAsync.js';
import ApiResponse from '../utils/apiResponse.js';

export const loadingPointController = {
  getAll: catchAsync(async (req, res) => {
    const loadingPoints = await loadingPointService.getAll(req.query);
    res.json(ApiResponse.success(loadingPoints));
  }),

  getById: catchAsync(async (req, res) => {
    const loadingPoint = await loadingPointService.getById(req.params.id);
    res.json(ApiResponse.success(loadingPoint));
  }),

  create: catchAsync(async (req, res) => {
    const loadingPoint = await loadingPointService.create(req.body);
    res.status(201).json(ApiResponse.created(loadingPoint, 'Loading point created successfully'));
  }),

  update: catchAsync(async (req, res) => {
    const loadingPoint = await loadingPointService.update(req.params.id, req.body);
    res.json(ApiResponse.success(loadingPoint, 'Loading point updated successfully'));
  }),

  delete: catchAsync(async (req, res) => {
    const result = await loadingPointService.delete(req.params.id);
    res.json(ApiResponse.success(result));
  }),
};

export const dumpingPointController = {
  getAll: catchAsync(async (req, res) => {
    const dumpingPoints = await dumpingPointService.getAll(req.query);
    res.json(ApiResponse.success(dumpingPoints));
  }),

  getById: catchAsync(async (req, res) => {
    const dumpingPoint = await dumpingPointService.getById(req.params.id);
    res.json(ApiResponse.success(dumpingPoint));
  }),

  create: catchAsync(async (req, res) => {
    const dumpingPoint = await dumpingPointService.create(req.body);
    res.status(201).json(ApiResponse.created(dumpingPoint, 'Dumping point created successfully'));
  }),

  update: catchAsync(async (req, res) => {
    const dumpingPoint = await dumpingPointService.update(req.params.id, req.body);
    res.json(ApiResponse.success(dumpingPoint, 'Dumping point updated successfully'));
  }),

  delete: catchAsync(async (req, res) => {
    const result = await dumpingPointService.delete(req.params.id);
    res.json(ApiResponse.success(result));
  }),
};

export const roadSegmentController = {
  getAll: catchAsync(async (req, res) => {
    const roadSegments = await roadSegmentService.getAll(req.query);
    res.json(ApiResponse.success(roadSegments));
  }),

  getById: catchAsync(async (req, res) => {
    const roadSegment = await roadSegmentService.getById(req.params.id);
    res.json(ApiResponse.success(roadSegment));
  }),

  create: catchAsync(async (req, res) => {
    const roadSegment = await roadSegmentService.create(req.body);
    res.status(201).json(ApiResponse.created(roadSegment, 'Road segment created successfully'));
  }),

  update: catchAsync(async (req, res) => {
    const roadSegment = await roadSegmentService.update(req.params.id, req.body);
    res.json(ApiResponse.success(roadSegment, 'Road segment updated successfully'));
  }),

  delete: catchAsync(async (req, res) => {
    const result = await roadSegmentService.delete(req.params.id);
    res.json(ApiResponse.success(result));
  }),
};
