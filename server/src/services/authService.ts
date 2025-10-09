import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const registerUser = async (username: string, email: string, password: string) => {
  try {
    console.log('🔍 Checking for existing user...');
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      const message = existingUser.email === email ? 'Email already registered' : 'Username already taken';
      console.log('❌ User already exists:', message);
      return { error: { status: 400, message } } as const;
    }

    console.log('👤 Creating new user...');
    const user = new User({ username, email, password });
    await user.save();
    console.log('✅ User saved to database:', user._id);

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error('❌ JWT_SECRET not found in environment');
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    console.log('🔑 Generating JWT token...');
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    console.log('✅ Registration completed successfully');
    return {
      token,
      user: { id: user._id, username: user.username, email: user.email }
    } as const;
  } catch (error) {
    console.error('💥 Error in registerUser:', error);
    throw error;
  }
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


