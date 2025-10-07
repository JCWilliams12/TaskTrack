import { renderHook, act } from '@testing-library/react';
import { useTasks } from './useTasks';

vi.mock('../api/tasks', () => ({
  listTasks: vi.fn(async () => ([])),
  createTask: vi.fn(async (p: any) => ({ _id: '1', title: p.title, status: 'pending', priority: 'medium', userId: 'u', createdAt: '', updatedAt: '' })),
  updateTask: vi.fn(async (_id: string, p: any) => ({ _id, title: 't', status: p.status || 'pending', priority: 'medium', userId: 'u', createdAt: '', updatedAt: '' })),
  deleteTask: vi.fn(async () => {}),
  fetchStats: vi.fn(async () => ({ totalTasks: 0, completionRate: 0, statusBreakdown: [], priorityBreakdown: [] })),
}));

describe('useTasks', () => {
  it('creates and updates a task in local state', async () => {
    const { result } = renderHook(() => useTasks());

    await act(async () => {
      await result.current.createTask({ title: 'Test' });
    });
    expect(result.current.tasks.length).toBe(1);

    await act(async () => {
      await result.current.updateTask('1', { status: 'completed' });
    });
    expect(result.current.tasks[0].status).toBe('completed');
  });
});


