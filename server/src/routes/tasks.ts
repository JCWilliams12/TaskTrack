import express from 'express';
import { authenticateToken, type AuthRequest } from '../middleware/auth.js';
import { validate, taskValidators } from '../middleware/validation.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import * as taskController from '../controllers/taskController.js';

const router = express.Router();

// Get all tasks for the authenticated user
router.get('/', validate(taskValidators.list), authenticateToken, asyncHandler(taskController.getAll));

// Get a single task
router.get('/:id', validate(taskValidators.get), authenticateToken, asyncHandler(taskController.getOne));

// Create a new task
router.post('/', validate(taskValidators.create), authenticateToken, asyncHandler(taskController.create));

// Update a task
router.put('/:id', validate(taskValidators.update), authenticateToken, asyncHandler(taskController.update));

// Delete a task
router.delete('/:id', validate(taskValidators.remove), authenticateToken, asyncHandler(taskController.remove));

// Get task statistics
router.get('/stats/summary', authenticateToken, asyncHandler(taskController.summary));

export default router;
