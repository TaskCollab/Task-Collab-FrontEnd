import axios from 'axios';

interface RoleType {
  roleId: number;
  roleName: string;
}
interface UserType {
  userId: number;
  username: string;
  isAdmin?: boolean;
  role: RoleType;
}

const API_BASE_URL = '/api';

export const getUsers = async (): Promise<UserType[]> => {
  const response = await axios.get(`${API_BASE_URL}/users`);
  return response.data;
};

export const updateUserRole = async (userId: number, roleId: number): Promise<void> => {
//since back-end does not have end API yet, I willk just do a place holder here.
  await axios.put(`${API_BASE_URL}/users/${userId}/role`, { roleId });
};

export const deleteUser = async (userId: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/users/${userId}`);
};
