import React, { useState, useEffect } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useTaskStats } from '../hooks/useTasks';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import { CreateTaskData, UpdateTaskData } from '../types/Task';

const TaskList: React.FC = () => {
  const { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask, toggleTaskStatus } = useTasks();
  const { stats } = useTaskStats();
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  useEffect(() => {
    fetchTasks(filters);
  }, [filters]);

  const handleCreateTask = async (taskData: CreateTaskData) => {
    try {
      await createTask(taskData);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleUpdateTask = async (id: string, updates: UpdateTaskData) => {
    try {
      await updateTask(id, updates);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      await toggleTaskStatus(id, currentStatus);
    } catch (error) {
      console.error('Failed to toggle task status:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    return true;
  });

  return (
    <div className="task-list-container">
      <div className="task-header">
        <div className="task-title-section">
          <h2>My Tasks</h2>
          {stats && (
            <div className="task-stats">
              <span className="stat-item">
                Total: <strong>{stats.totalTasks}</strong>
              </span>
              <span className="stat-item">
                Completion: <strong>{stats.completionRate}%</strong>
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
        >
          + New Task
        </button>
      </div>

      <div className="task-filters">
        <div className="filter-group">
          <label htmlFor="status-filter">Status:</label>
          <select
            id="status-filter"
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="priority-filter">Priority:</label>
          <select
            id="priority-filter"
            value={filters.priority}
            onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
          >
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-filter">Sort by:</label>
          <select
            id="sort-filter"
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
          >
            <option value="createdAt">Created Date</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="order-filter">Order:</label>
          <select
            id="order-filter"
            value={filters.sortOrder}
            onChange={(e) => setFilters(prev => ({ ...prev, sortOrder: e.target.value }))}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading tasks...</div>
      ) : filteredTasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks found. Create your first task to get started!</p>
        </div>
      ) : (
        <div className="task-grid">
          {filteredTasks.map(task => (
            <TaskItem
              key={task._id}
              task={task}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}

      {showForm && (
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default TaskList;
