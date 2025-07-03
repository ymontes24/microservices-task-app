import axios from 'axios';
import { CreateTaskData, Task, UpdateTaskData } from '../types';
import authService from './auth.service';

const API_URL = process.env.REACT_APP_TASK_API_URL || 'http://localhost:3002/tasks';

// Create request interceptor to add auth token
axios.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const taskService = {
  getTasks: async (): Promise<Task[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },
  
  getTask: async (id: string): Promise<Task> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },
  
  createTask: async (data: CreateTaskData): Promise<Task> => {
    const response = await axios.post(API_URL, data);
    return response.data;
  },
  
  updateTask: async (id: string, data: UpdateTaskData): Promise<Task> => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  },
  
  deleteTask: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  }
};

export default taskService;
