import axios from "axios";
import { TASK_API_URL } from "../Utils/Constants";

const taskApiClient = axios.create({
  baseURL: TASK_API_URL,
  headers: {
    "Content-Type": "application/json",
  }
});

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
    const response = await taskApiClient.post("/tasks", taskData);
    return response.data;
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
  deadline: string;
}

export interface Task extends TaskDTO {
  id: number;
  createdAt: string;
  updatedAt: string;
}