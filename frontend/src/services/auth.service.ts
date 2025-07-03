import axios from 'axios';
import { AuthResponse, LoginData, RegisterData } from '../types';

const API_URL = process.env.REACT_APP_AUTH_API_URL || 'http://localhost:3001/auth';

const authService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/register`, data);
    return response.data;
  },
  
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/login`, data);
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: (): any => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },
  
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },
  
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  }
};

export default authService;
