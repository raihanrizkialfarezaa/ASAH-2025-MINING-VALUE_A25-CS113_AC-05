import { body, param, query } from 'express-validator';

export const createVesselValidator = [
  body('code').trim().notEmpty().withMessage('Vessel code is required'),
  body('name')
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage('Vessel name must be between 3 and 150 characters'),
  body('vesselType')
    .isIn(['MOTHER_VESSEL', 'BARGE', 'TUG_BOAT'])
    .withMessage('Invalid vessel type'),
  body('capacity').isFloat({ min: 0 }).withMessage('Capacity must be a positive number'),
  body('owner')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Owner must not exceed 200 characters'),
  body('gt').optional().isFloat({ min: 0 }).withMessage('GT must be a positive number'),
  body('dwt').optional().isFloat({ min: 0 }).withMessage('DWT must be a positive number'),
  body('loa').optional().isFloat({ min: 0 }).withMessage('LOA must be a positive number'),
  body('isOwned').optional().isBoolean().withMessage('isOwned must be a boolean'),
  body('status')
    .optional()
    .isIn(['AVAILABLE', 'LOADING', 'SAILING', 'DISCHARGING', 'MAINTENANCE', 'CHARTERED'])
    .withMessage('Invalid status'),
];

export const updateVesselValidator = [
  param('id').trim().notEmpty().withMessage('Vessel ID is required'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage('Vessel name must be between 3 and 150 characters'),
  body('vesselType')
    .optional()
    .isIn(['MOTHER_VESSEL', 'BARGE', 'TUG_BOAT'])
    .withMessage('Invalid vessel type'),
  body('capacity').optional().isFloat({ min: 0 }).withMessage('Capacity must be a positive number'),
  body('owner')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Owner must not exceed 200 characters'),
  body('gt').optional().isFloat({ min: 0 }).withMessage('GT must be a positive number'),
  body('dwt').optional().isFloat({ min: 0 }).withMessage('DWT must be a positive number'),
  body('loa').optional().isFloat({ min: 0 }).withMessage('LOA must be a positive number'),
  body('isOwned').optional().isBoolean().withMessage('isOwned must be a boolean'),
  body('status')
    .optional()
    .isIn(['AVAILABLE', 'LOADING', 'SAILING', 'DISCHARGING', 'MAINTENANCE', 'CHARTERED'])
    .withMessage('Invalid status'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
];

export const getVesselByIdValidator = [
  param('id').trim().notEmpty().withMessage('Vessel ID is required'),
];

export const getVesselsQueryValidator = [
  query('status')
    .optional()
    .isIn(['AVAILABLE', 'LOADING', 'SAILING', 'DISCHARGING', 'MAINTENANCE', 'CHARTERED'])
    .withMessage('Invalid status'),
  query('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];
