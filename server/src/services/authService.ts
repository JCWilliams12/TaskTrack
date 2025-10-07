import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const registerUser = async (username: string, email: string, password: string) => {
  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    const message = existingUser.email === email ? 'Email already registered' : 'Username already taken';
    return { error: { status: 400, message } } as const;
  }

  const user = new User({ username, email, password });
  await user.save();

  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

  return {
    token,
    user: { id: user._id, username: user.username, email: user.email }
  } as const;
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    return { error: { status: 401, message: 'Invalid credentials' } } as const;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return { error: { status: 401, message: 'Invalid credentials' } } as const;
  }

  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

  return {
    token,
    user: { id: user._id, username: user.username, email: user.email }
  } as const;
};


