import axios from "axios";
import { ROLE_API_URL, TASK_API_URL, USER_API_URL } from "../Utils/Constants";

export const UsersAPI = {
  getAllUsers: async () => {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${USER_API_URL}`, {
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
    const response = await axios.post(`${USER_API_URL}/create`, userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  updateUserRole: async (userId: string, roleData: RoleDTO) => {
    const token = localStorage.getItem("authToken");
    const response = await axios.put(
      `${USER_API_URL}/${userId}/role`,
      roleData,
      { 
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json" 
        } 
      }
    );
    return response.data;
  },

  deleteUser: async (userId: string) => {
    const token = localStorage.getItem("authToken");
    await axios.delete(`${USER_API_URL}users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  //newly added Role Management
  getAllRoles: async () => {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(`${ROLE_API_URL}search`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data as RoleDTO[];
  },

  createRole: async (roleData: { roleName: string, permissions: object }) => {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(`${ROLE_API_URL}/create`, roleData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  deleteRole: async (roleName: string) => {
    const token = localStorage.getItem("authToken");
    await axios.delete(`${ROLE_API_URL}${roleName}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};

export interface UserDTO {
  userId: number;
  username: string;
  role: string;
  isAdmin?: boolean;
}

export interface RoleDTO {
  permissions: { create: false; read: false; update: false; delete: false; };
  roleId: number; 
  roleName: string;
  createPermission: boolean;
  readPermission: boolean;
  updatePermission: boolean;
  deletePermission: boolean;
}