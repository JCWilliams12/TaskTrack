import type { Request, Response, NextFunction } from 'express';
import { validationResult, body, param, query } from 'express-validator';
import { ApiError } from '../utils/ApiError.js';

export const validate = (validations: any[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return next(new ApiError(400, 'Validation failed', errors.array()));
  };
};

export const authValidators = {
  register: [
    body('username').isString().trim().isLength({ min: 3, max: 20 }),
    body('email').isString().trim().isEmail(),
    body('password').isString().isLength({ min: 6 })
  ],
  login: [
    body('email').isString().trim().isEmail(),
    body('password').isString().isLength({ min: 6 })
  ]
};

export const taskValidators = {
  list: [
    query('status').optional().isIn(['pending', 'in-progress', 'completed']),
    query('priority').optional().isIn(['low', 'medium', 'high']),
    query('sortBy').optional().isIn(['createdAt', 'dueDate', 'priority']),
    query('sortOrder').optional().isIn(['asc', 'desc'])
  ],
  get: [
    param('id').isMongoId()
  ],
  create: [
    body('title').isString().trim().isLength({ min: 1, max: 100 }),
    body('description').optional().isString().trim().isLength({ max: 500 }),
    body('status').optional().isIn(['pending', 'in-progress', 'completed']),
    body('priority').optional().isIn(['low', 'medium', 'high']),
    body('dueDate').optional().isISO8601().toDate()
  ],
  update: [
    param('id').isMongoId(),
    body('title').optional().isString().trim().isLength({ min: 1, max: 100 }),
    body('description').optional().isString().trim().isLength({ max: 500 }),
    body('status').optional().isIn(['pending', 'in-progress', 'completed']),
    body('priority').optional().isIn(['low', 'medium', 'high']),
    body('dueDate').optional().custom((value) => {
      if (value === null) return true; // allow null to clear
      return !isNaN(Date.parse(value));
    })
  ],
  remove: [
    param('id').isMongoId()
  ]
};


