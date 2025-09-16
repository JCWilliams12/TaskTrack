import React, { useState } from 'react';
import { Task } from '../types/Task';

interface TaskItemProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onToggleStatus: (id: string, currentStatus: string) => Promise<void>;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate, onDelete, onToggleStatus }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggleStatus = async () => {
    setLoading(true);
    try {
      await onToggleStatus(task._id, task.status);
    } catch (error) {
      console.error('Failed to toggle task status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setLoading(true);
      try {
        await onDelete(task._id);
      } catch (error) {
        console.error('Failed to delete task:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'in-progress': return 'status-in-progress';
      case 'pending': return 'status-pending';
      default: return '';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <div className={`task-item ${getPriorityColor(task.priority)} ${getStatusColor(task.status)} ${isOverdue ? 'overdue' : ''}`}>
      <div className="task-header">
        <div className="task-title">
          <h4>{task.title}</h4>
          <div className="task-badges">
            <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            <span className={`status-badge ${getStatusColor(task.status)}`}>
              {task.status.replace('-', ' ')}
            </span>
          </div>
        </div>
        <div className="task-actions">
          <button
            onClick={handleToggleStatus}
            disabled={loading}
            className="btn btn-sm btn-secondary"
            title={`Mark as ${task.status === 'pending' ? 'in progress' : task.status === 'in-progress' ? 'completed' : 'pending'}`}
          >
            {loading ? '...' : task.status === 'pending' ? 'Start' : task.status === 'in-progress' ? 'Complete' : 'Reopen'}
          </button>
          <button
            onClick={() => setIsEditing(true)}
            disabled={loading}
            className="btn btn-sm btn-outline"
            title="Edit task"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="btn btn-sm btn-danger"
            title="Delete task"
          >
            Delete
          </button>
        </div>
      </div>

      {task.description && (
        <div className="task-description">
          <p>{task.description}</p>
        </div>
      )}

      <div className="task-meta">
        {task.dueDate && (
          <div className={`task-due-date ${isOverdue ? 'overdue' : ''}`}>
            <strong>Due:</strong> {formatDate(task.dueDate)}
          </div>
        )}
        <div className="task-created">
          Created: {formatDate(task.createdAt)}
        </div>
      </div>

      {isEditing && (
        <TaskForm
          onSubmit={async (updates) => {
            await onUpdate(task._id, updates);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
          initialData={task}
          isEditing={true}
        />
      )}
    </div>
  );
};

export default TaskItem;
