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
  getUserTasks: async () => {
    const response = await taskApiClient.get("/my-tasks");
    return response.data;
  },

  createTask: async (taskData: TaskDTO) => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(TASK_API_URL + "create", taskData, { // TASK_API_URL is the base URL
          headers: {
              Authorization: `Bearer ${token}`, // Add the Authorization header
          },
      });
      return response.data;
  } catch (error) {
      console.error("Error in createTask API call", error);
      throw error;
  }
},

  getTask: async (id: number) => {
    const response = await taskApiClient.get(`${id}`);
    return response.data;
  },

  updateTask: async (id: number, taskData: Partial<TaskDTO>) => {
    const response = await taskApiClient.put(`/update/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id: number) => {
    const response = await taskApiClient.delete(`delete/${id}`);
    return response.data;
  }
};

interface TaskDTO {
  taskTitle: string;
  description: string;
  assignedTo: string;
  status: string;
  priority: string;
  deadline: string;
}

export interface Task extends TaskDTO {
  id: number;
  createdAt: string;
  updatedAt: string;
}