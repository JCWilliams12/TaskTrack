import Task from '../models/Task.js';
import type mongoose from 'mongoose';

export const listTasks = async (
  userId: mongoose.Types.ObjectId,
  filters: { status?: string; priority?: string; sortBy?: string; sortOrder?: string }
) => {
  const { status, priority, sortBy = 'createdAt', sortOrder = 'desc' } = filters;

  const query: any = { userId };
  if (status && ['pending', 'in-progress', 'completed'].includes(status)) {
    query.status = status;
  }
  if (priority && ['low', 'medium', 'high'].includes(priority)) {
    query.priority = priority;
  }

  const sortOptions: any = {};
  if (sortBy === 'dueDate') {
    sortOptions.dueDate = sortOrder === 'asc' ? 1 : -1;
  } else if (sortBy === 'priority') {
    sortOptions.priority = sortOrder === 'asc' ? 1 : -1;
  } else {
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
  }

  return Task.find(query).sort(sortOptions);
};

export const getTask = async (userId: mongoose.Types.ObjectId, id: string) => {
  return Task.findOne({ _id: id, userId });
};

export const createTask = async (
  userId: mongoose.Types.ObjectId,
  payload: { title: string; description?: string; status?: string; priority?: string; dueDate?: Date | null }
) => {
  const { title, description, status, priority, dueDate } = payload;
  const task = new Task({
    title,
    description,
    status: status || 'pending',
    priority: priority || 'medium',
    dueDate: dueDate ?? undefined,
    userId
  });
  await task.save();
  return task;
};

export const updateTask = async (
  userId: mongoose.Types.ObjectId,
  id: string,
  payload: { title?: string; description?: string; status?: string; priority?: string; dueDate?: Date | null }
) => {
  return Task.findOneAndUpdate(
    { _id: id, userId },
    {
      ...(payload.title && { title: payload.title }),
      ...(payload.description !== undefined && { description: payload.description }),
      ...(payload.status && { status: payload.status }),
      ...(payload.priority && { priority: payload.priority }),
      ...(payload.dueDate !== undefined && { dueDate: payload.dueDate ?? null })
    },
    { new: true, runValidators: true }
  );
};

export const deleteTask = async (userId: mongoose.Types.ObjectId, id: string) => {
  return Task.findOneAndDelete({ _id: id, userId });
};

export const getStats = async (userId: mongoose.Types.ObjectId) => {
  const stats = await Task.aggregate([
    { $match: { userId } },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  const priorityStats = await Task.aggregate([
    { $match: { userId } },
    { $group: { _id: '$priority', count: { $sum: 1 } } }
  ]);

  const totalTasks = await Task.countDocuments({ userId });
  const completedTasks = stats.find(stat => stat._id === 'completed')?.count || 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return { totalTasks, completionRate, statusBreakdown: stats, priorityBreakdown: priorityStats };
};


