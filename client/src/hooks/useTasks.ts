import { useState, useEffect } from 'react';
import axiosInstance from '../api/config';
import { Task, TaskStats, CreateTaskData, UpdateTaskData } from '../types/Task';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async (filters?: { status?: string; priority?: string; sortBy?: string; sortOrder?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.priority) params.append('priority', filters.priority);
      if (filters?.sortBy) params.append('sortBy', filters.sortBy);
      if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await axiosInstance.get(`/tasks?${params.toString()}`);
      setTasks(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: CreateTaskData) => {
    try {
      const response = await axiosInstance.post('/tasks', taskData);
      setTasks(prev => [response.data, ...prev]);
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to create task');
    }
  };

  const updateTask = async (id: string, taskData: UpdateTaskData) => {
    try {
      const response = await axiosInstance.put(`/tasks/${id}`, taskData);
      setTasks(prev => prev.map(task => task._id === id ? response.data : task));
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update task');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await axiosInstance.delete(`/tasks/${id}`);
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
      const response = await axiosInstance.get('/tasks/stats/summary');
      setStats(response.data);
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
