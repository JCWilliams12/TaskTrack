import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from './LoginForm';
import { AuthProvider } from '../contexts/AuthContext';

vi.mock('../api/auth', () => ({
  login: vi.fn(async () => ({ token: 't', user: { id: '1', username: 'john', email: 'john@example.com' } })),
  me: vi.fn(async () => ({ user: { id: '1', username: 'john', email: 'john@example.com' } })),
}));

describe('LoginForm', () => {
  it('submits login credentials', async () => {
    render(
      <AuthProvider>
        <LoginForm onToggleMode={() => {}} />
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => expect(localStorage.getItem('token')).toBe('t'));
  });
});


