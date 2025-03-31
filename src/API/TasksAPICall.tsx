import axios from "axios";
import { TASK_API_URL } from "../Utils/Constants";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const taskApiClient = axios.create({
  baseURL: TASK_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    console.error("API Error:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "An API error occurred");
  }
  console.error("Unexpected error:", error);
  throw new Error("An unexpected error occurred");
};



const getPermissions = (): string[] => {
  const token = localStorage.getItem("authToken");
  if (token) {
    try {
      const decodedToken: any = jwtDecode(token); 
      return decodedToken.roles || [];
    } catch (error) {
      console.error("Invalid JWT:", error);
    }
  }
  return [];
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
    const permissions = getPermissions(); 
    console.log("User permissions:", permissions);

    if (!permissions.includes("READ")) {
      toast.error("You do not have permission to read tickets");
      return [];
    }

    try {
      const response = await taskApiClient.get("/my-tasks");
      return response.data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  },

  createTask: async (taskData: TaskDTO) => {
    const permissions = getPermissions();
    if (!permissions.includes("CREATE")) {
      toast.error("You do not have permission to create tickets");
      return null;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(`${TASK_API_URL}/create`, taskData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error in createTask API call", error);
      throw error;
    }
  },

  getTask: async (id: number) => {
    try {
      const response = await taskApiClient.get(`${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching task:", error);
      throw error;
    }
  },

  updateTask: async (id: number, taskData: Partial<TaskDTO>) => {
    const permissions = getPermissions();
    if (!permissions.includes("UPDATE")) {
      toast.error("You do not have permission to update tickets");
      return null;
    }

    try {
      const response = await taskApiClient.put(`/update/${id}`, taskData);
      return response.data;
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  },

  deleteTask: async (id: number) => {
    const permissions = getPermissions();
    if (!permissions.includes("DELETE")) {
      toast.error("You do not have permission to delete tickets");
      return null;
    }

    try {
      const response = await taskApiClient.delete(`/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  },
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
