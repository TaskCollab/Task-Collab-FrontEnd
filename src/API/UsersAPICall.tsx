import axios from "axios";
import { USER_API_URL } from "../Utils/Constants";
import { ROLE_API_URL } from "../Utils/Constants";

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
    role: number; // roleId
  }) => {
    const token = localStorage.getItem('authToken');
    const response = await axios.post(
      `${USER_API_URL}/create`,
      {
        username: userData.username,
        password: userData.password,
        role: {
          roleId: userData.role, // Send the roleId
        },
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  updateUserRole: async (userId: string, newRole: string) => {
    const token = localStorage.getItem("authToken");
    const response = await axios.put(
      `${USER_API_URL}/${userId}/role`, 
      newRole,
      { headers: { Authorization: `Bearer ${token}`,
    'Content-Type': 'text/plain' } }
    );
    return response.data;
  },

  deleteUser: async (userId: string) => {
    const token = localStorage.getItem("authToken");
    await axios.delete(`${USER_API_URL}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  //newly added Role Management
  getAllRoles: async () => {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(`${ROLE_API_URL}search`,{}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  createRole: async (roleData: {
    roleName: string,
    createPermission: boolean,
    readPermission: boolean,
    deletePermission: boolean,
    updatePermission: boolean,
  }) => {
    const token = localStorage.getItem('authToken');
    const response = await axios.post(`${ROLE_API_URL}create`, roleData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  deleteRole: async (roleName: string) => {
    const token = localStorage.getItem("authToken");
    await axios.post(`${ROLE_API_URL}delete/${roleName}`,{}, {
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
  createPermission?: boolean;
  readPermission?: boolean;
  updatePermission?: boolean;
  deletePermission?: boolean;
  userName?: string;
}