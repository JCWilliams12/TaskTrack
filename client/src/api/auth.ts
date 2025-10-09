import axiosInstance from './config';

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const { data } = await axiosInstance.post<AuthResponse>('/auth/login', { email, password });
  return data;
};

export const register = async (username: string, email: string, password: string): Promise<AuthResponse> => {
  console.log('🌐 API: Making registration request...', { username, email });
  try {
    const response = await axiosInstance.post<AuthResponse>('/auth/register', { username, email, password });
    console.log('✅ API: Registration response received:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ API: Registration request failed:', error);
    throw error;
  }
};

export const me = async (): Promise<{ user: User }> => {
  const { data } = await axiosInstance.get<{ user: User }>('/auth/me');
  return data;
};


