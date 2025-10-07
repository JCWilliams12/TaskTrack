import express from 'express';
import { authenticateToken, type AuthRequest } from '../middleware/auth.js';
import { validate, authValidators } from '../middleware/validation.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// Register
router.post('/register', validate(authValidators.register), asyncHandler(authController.register));

// Login
router.post('/login', validate(authValidators.login), asyncHandler(authController.login));

// Get current user
router.get('/me', authenticateToken, authController.me);

export default router;
