import axiosInstance from './config';
import type { Task, TaskStats, CreateTaskData, UpdateTaskData } from '../types/Task';

export const listTasks = async (filters?: { status?: string; priority?: string; sortBy?: string; sortOrder?: string }): Promise<Task[]> => {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.priority) params.append('priority', filters.priority);
  if (filters?.sortBy) params.append('sortBy', filters.sortBy);
  if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
  const { data } = await axiosInstance.get<Task[]>(`/tasks?${params.toString()}`);
  return data;
};

export const createTask = async (payload: CreateTaskData): Promise<Task> => {
  const { data } = await axiosInstance.post<Task>('/tasks', payload);
  return data;
};

export const updateTask = async (id: string, payload: UpdateTaskData): Promise<Task> => {
  const { data } = await axiosInstance.put<Task>(`/tasks/${id}`, payload);
  return data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/tasks/${id}`);
};

export const fetchStats = async (): Promise<TaskStats> => {
  const { data } = await axiosInstance.get<TaskStats>('/tasks/stats/summary');
  return data;
};


