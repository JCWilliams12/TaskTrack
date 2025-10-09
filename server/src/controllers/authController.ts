import type { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/authService.js';

export const register = async (req: Request, res: Response) => {
  try {
    console.log('🔐 Registration attempt:', { username: req.body.username, email: req.body.email });
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      console.log('❌ Missing required fields:', { username: !!username, email: !!email, password: !!password });
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }
    
    const result = await registerUser(username, email, password);
    if ('error' in result) {
      console.log('❌ Registration error:', result.error);
      return res.status(result.error.status).json({ message: result.error.message });
    }
    
    console.log('✅ Registration successful:', { userId: result.user.id, username: result.user.username });
    return res.status(201).json({ message: 'User registered successfully', ...result });
  } catch (error) {
    console.error('💥 Registration exception:', error);
    return res.status(500).json({ message: 'Internal server error during registration' });
  }
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


