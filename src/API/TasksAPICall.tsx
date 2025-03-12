import axios from "axios";
import { TASK_API_URL } from "../Utils/Constants";

const taskApiClient = axios.create({
  baseURL: TASK_API_URL,
  headers: {
    "Content-Type": "application/json",
  }
});

const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    console.error('API Error:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'An API error occurred');
  }
  console.error('Unexpected error:', error);
  throw new Error('An unexpected error occurred');
};

taskApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const TaskAPI = {
  getUserTasks: async (filters?: {
    search?: string;
    priority?: string;
    status?: string;
  }) => {
    const response = await taskApiClient.get("/my-tasks", {
      params: {
        q: filters?.search,
        priority: filters?.priority,
        status: filters?.status
      }
    });
    return response.data;
  },
  
  createTask: async (taskData: TaskDTO) => {
    try{
      const response = await taskApiClient.post('/tasks', taskData);
      return response.data;
    }catch (error){
      handleApiError(error);
      throw error;
    }
  },

  getTask: async (id: number) => {
    const response = await taskApiClient.get(`/tasks/${id}`);
    return response.data;
  },

  updateTask: async (id: number, taskData: Partial<TaskDTO>) => {
    const response = await taskApiClient.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id: number) => {
    const response = await taskApiClient.delete(`/tasks/${id}`);
    return response.data;
  }
};

interface TaskDTO {
  taskTitle: string;
  description: string;
  assignedTo: number;
  status: string;
  priority: string;
  deadline: string;
}

export interface Task extends TaskDTO {
  id: number;
  createdAt: string;
  updatedAt: string;
}