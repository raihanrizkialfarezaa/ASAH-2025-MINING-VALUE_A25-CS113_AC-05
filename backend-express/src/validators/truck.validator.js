import { body, param, query } from 'express-validator';

export const createTruckValidator = [
  body('code')
    .trim()
    .notEmpty()
    .withMessage('Truck code is required')
    .matches(/^[A-Z]{1,2}-\d{3,4}$/)
    .withMessage('Truck code must follow format: H-001 or HA-0001'),
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Truck name must be between 3 and 100 characters'),
  body('brand')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Brand must not exceed 50 characters'),
  body('model')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Model must not exceed 50 characters'),
  body('yearManufacture')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage('Invalid manufacture year'),
  body('capacity').isFloat({ min: 0 }).withMessage('Capacity must be a positive number'),
  body('fuelCapacity')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Fuel capacity must be a positive number'),
  body('status')
    .optional()
    .isIn([
      'IDLE',
      'HAULING',
      'LOADING',
      'DUMPING',
      'IN_QUEUE',
      'MAINTENANCE',
      'BREAKDOWN',
      'REFUELING',
      'STANDBY',
      'OUT_OF_SERVICE',
    ])
    .withMessage('Invalid status'),
];

export const updateTruckValidator = [
  param('id').trim().notEmpty().withMessage('Truck ID is required'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Truck name must be between 3 and 100 characters'),
  body('brand')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Brand must not exceed 50 characters'),
  body('model')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Model must not exceed 50 characters'),
  body('capacity').optional().isFloat({ min: 0 }).withMessage('Capacity must be a positive number'),
  body('fuelCapacity')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Fuel capacity must be a positive number'),
  body('status')
    .optional()
    .isIn([
      'IDLE',
      'HAULING',
      'LOADING',
      'DUMPING',
      'IN_QUEUE',
      'MAINTENANCE',
      'BREAKDOWN',
      'REFUELING',
      'STANDBY',
      'OUT_OF_SERVICE',
    ])
    .withMessage('Invalid status'),
  body('currentLocation')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Current location must not exceed 200 characters'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
];

export const updateTruckStatusValidator = [
  param('id').trim().notEmpty().withMessage('Truck ID is required'),
  body('status')
    .isIn([
      'IDLE',
      'HAULING',
      'LOADING',
      'DUMPING',
      'IN_QUEUE',
      'MAINTENANCE',
      'BREAKDOWN',
      'REFUELING',
      'STANDBY',
      'OUT_OF_SERVICE',
    ])
    .withMessage('Invalid status'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location must not exceed 200 characters'),
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Reason must not exceed 500 characters'),
];

export const getTruckByIdValidator = [
  param('id').trim().notEmpty().withMessage('Truck ID is required'),
];

export const getTrucksQueryValidator = [
  query('status')
    .optional()
    .isIn([
      'IDLE',
      'HAULING',
      'LOADING',
      'DUMPING',
      'IN_QUEUE',
      'MAINTENANCE',
      'BREAKDOWN',
      'REFUELING',
      'STANDBY',
      'OUT_OF_SERVICE',
    ])
    .withMessage('Invalid status'),
  query('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];
