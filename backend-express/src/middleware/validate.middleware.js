import { validationResult } from 'express-validator';
import ApiResponse from '../utils/apiResponse.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().reduce((acc, error) => {
      acc[error.path] = error.msg;
      return acc;
    }, {});

    return res.status(422).json(ApiResponse.validationError(formattedErrors));
  }

  next();
};
