import express from 'express';
import Task from '../models/Task.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Get all tasks for the authenticated user
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { status, priority, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    let query: any = { userId: req.user!._id };
    
    // Filter by status
    if (status && ['pending', 'in-progress', 'completed'].includes(status as string)) {
      query.status = status;
    }
    
    // Filter by priority
    if (priority && ['low', 'medium', 'high'].includes(priority as string)) {
      query.priority = priority;
    }
    
    // Sort options
    const sortOptions: any = {};
    if (sortBy === 'dueDate') {
      sortOptions.dueDate = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      sortOptions.priority = sortOrder === 'asc' ? 1 : -1;
    } else {
      sortOptions[sortBy as string] = sortOrder === 'asc' ? 1 : -1;
    }
    
    const tasks = await Task.find(query).sort(sortOptions);
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error while fetching tasks' });
  }
});

// Get a single task
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user!._id });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Server error while fetching task' });
  }
});

// Create a new task
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    
    const task = new Task({
      title,
      description,
      status: status || 'pending',
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : undefined,
      userId: req.user!._id
    });
    
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error while creating task' });
  }
});

// Update a task
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!._id },
      {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null })
      },
      { new: true, runValidators: true }
    );
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error while updating task' });
  }
});

// Delete a task
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user!._id });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error while deleting task' });
  }
});

// Get task statistics
router.get('/stats/summary', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    
    const stats = await Task.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const priorityStats = await Task.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const totalTasks = await Task.countDocuments({ userId });
    const completedTasks = stats.find(stat => stat._id === 'completed')?.count || 0;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    res.json({
      totalTasks,
      completionRate,
      statusBreakdown: stats,
      priorityBreakdown: priorityStats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error while fetching statistics' });
  }
});

export default router;
