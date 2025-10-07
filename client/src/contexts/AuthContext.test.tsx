import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

vi.mock('../api/auth', () => ({
  me: vi.fn(async () => ({ user: { id: '1', username: 'john', email: 'john@example.com' } })),
  login: vi.fn(async () => ({ token: 't', user: { id: '1', username: 'john', email: 'john@example.com' } })),
  register: vi.fn(async () => ({ token: 't', user: { id: '2', username: 'amy', email: 'amy@example.com' } })),
}));

const Consumer = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>loading</div>;
  return <div>{user ? user.username : 'anon'}</div>;
};

describe('AuthContext', () => {
  it('renders anon when no token', async () => {
    localStorage.removeItem('token');
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );
    await waitFor(() => expect(screen.getByText('anon')).toBeInTheDocument());
  });
});


