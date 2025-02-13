import axios from 'axios';
import { AUTH_API_URL } from '../Utils/Constants.tsx';

export const login = async (username: string, password: string) => {
    try {
        const response = await axios.post(`${AUTH_API_URL}/login`, { username, password });
        localStorage.setItem('authToken', response.data.token);
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};


export const logout = async () => {
    try {
        const response = await axios.post(`${AUTH_API_URL}/logout`);
        localStorage.removeItem('authToken');
        return response.data;
    } catch (error) {
        console.error('Error logging out:', error);
        throw error;
    }
};