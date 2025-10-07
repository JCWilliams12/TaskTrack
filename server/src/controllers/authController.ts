import type { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/authService.js';

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const result = await registerUser(username, email, password);
  if ('error' in result) {
    return res.status(result.error.status).json({ message: result.error.message });
  }
  return res.status(201).json({ message: 'User registered successfully', ...result });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await loginUser(email, password);
  if ('error' in result) {
    return res.status(result.error.status).json({ message: result.error.message });
  }
  return res.json({ message: 'Login successful', ...result });
};

export const me = (req: Request, res: Response) => {
  const user = (req as any).user;
  return res.json({ user: { id: user._id, username: user.username, email: user.email } });
};


