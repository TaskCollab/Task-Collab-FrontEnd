import axios from "axios";
import { TASK_API_URL } from "../Utils/Constants";

export const UsersAPI = {
  getAllUsers: async () => {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${TASK_API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  createUser: async (userData: { 
    username: string; 
    password: string;
    role: string 
  }) => {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(`${TASK_API_URL}/users/create`, userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  updateUserRole: async (userId: string, newRole: string) => {
    const token = localStorage.getItem("authToken");
    const response = await axios.put(
      `${TASK_API_URL}/users/${userId}/role`,
      { roleName: newRole }, // Match Java DTO structure
      {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      }
    );
    return response.data;
  },

  deleteUser: async (userId: string) => {
    const token = localStorage.getItem("authToken");
    await axios.delete(`${TASK_API_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};

export interface UserDTO {
  userId: string;
  username: string;
  role: string;
  isAdmin?: boolean;
}

export interface RoleDTO {
  roleName: string;
  permissions?: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
}