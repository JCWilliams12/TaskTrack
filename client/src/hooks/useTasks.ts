import { useState, useEffect } from 'react';
import * as tasksApi from '../api/tasks';
import type { Task, TaskStats, CreateTaskData, UpdateTaskData } from '../types/Task';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async (filters?: { status?: string; priority?: string; sortBy?: string; sortOrder?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await tasksApi.listTasks(filters);
      setTasks(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: CreateTaskData) => {
    try {
      const data = await tasksApi.createTask(taskData);
      setTasks(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to create task');
    }
  };

  const updateTask = async (id: string, taskData: UpdateTaskData) => {
    try {
      const data = await tasksApi.updateTask(id, taskData);
      setTasks(prev => prev.map(task => task._id === id ? data : task));
      return data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update task');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await tasksApi.deleteTask(id);
      setTasks(prev => prev.filter(task => task._id !== id));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const toggleTaskStatus = async (id: string, currentStatus: string) => {
    const statusMap: { [key: string]: string } = {
      'pending': 'in-progress',
      'in-progress': 'completed',
      'completed': 'pending'
    };
    const newStatus = statusMap[currentStatus] || 'pending';
    return updateTask(id, { status: newStatus as any });
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus
  };
};

export const useTaskStats = () => {
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tasksApi.fetchStats();
      setStats(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refetch: fetchStats };
};
