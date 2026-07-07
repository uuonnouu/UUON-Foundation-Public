
import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

export const validateVisualization = [
  body('name').isLength({ min: 1, max: 100 }).trim().escape(),
  body('description').optional().isLength({ max: 500 }).trim().escape(),
  body('surfaceType').isIn([
    'triangular_prism', 'square', 'cube', 'tetrahedron', 'sphere',
    // Add all your valid surface types here
  ]),
  body('parameters').isObject(),
  body('visualMode').optional().isIn(['surface', 'wireframe', 'points']),
  body('colorMode').optional().isIn(['plasma', 'rainbow', 'gradient']),
  body('isPublic').optional().isBoolean(),
  handleValidationErrors
];

export const validateSession = [
  body('sessionId').isLength({ min: 1, max: 50 }).trim().escape(),
  body('name').isLength({ min: 1, max: 100 }).trim().escape(),
  body('description').optional().isLength({ max: 500 }).trim().escape(),
  body('parameters').isObject(),
  body('sharedWith').optional().isArray(),
  body('isPublic').optional().isBoolean(),
  handleValidationErrors
];

export const validateUser = [
  body('username').isLength({ min: 3, max: 30 }).trim().escape().matches(/^[a-zA-Z0-9_]+$/),
  body('password').isLength({ min: 8, max: 128 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
  handleValidationErrors
];

export const validateId = [
  param('id').isInt({ min: 1 }),
  handleValidationErrors
];
