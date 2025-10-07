import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.js';
import { listTasks, getTask, createTask, updateTask, deleteTask, getStats } from '../services/taskService.js';

export const getAll = async (req: AuthRequest, res: Response) => {
  const tasks = await listTasks(req.user!._id, {
    status: req.query.status as string | undefined,
    priority: req.query.priority as string | undefined,
    sortBy: (req.query.sortBy as string | undefined) ?? 'createdAt',
    sortOrder: (req.query.sortOrder as string | undefined) ?? 'desc'
  });
  return res.json(tasks);
};

export const getOne = async (req: AuthRequest, res: Response) => {
  const task = await getTask(req.user!._id, req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  return res.json(task);
};

export const create = async (req: AuthRequest, res: Response) => {
  const task = await createTask(req.user!._id, {
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
    priority: req.body.priority,
    dueDate: req.body.dueDate ?? undefined
  });
  return res.status(201).json(task);
};

export const update = async (req: AuthRequest, res: Response) => {
  const task = await updateTask(req.user!._id, req.params.id, {
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
    priority: req.body.priority,
    dueDate: req.body.dueDate ?? undefined
  });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  return res.json(task);
};

export const remove = async (req: AuthRequest, res: Response) => {
  const task = await deleteTask(req.user!._id, req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  return res.json({ message: 'Task deleted successfully' });
};

export const summary = async (req: AuthRequest, res: Response) => {
  const data = await getStats(req.user!._id);
  return res.json(data);
};


