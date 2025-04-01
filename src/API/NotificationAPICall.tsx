import axios from "axios";
import { USER_API_URL } from "../Utils/Constants";
import { Notification } from '../Utils/NotificationTypes';

export const NotificationAPI = {
  getUnreadNotifications: async (): Promise<Notification[]> => {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${USER_API_URL}/notifications/user/unread`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  markAsRead: async (notificationId: number): Promise<void> => {
    const token = localStorage.getItem("authToken");
    await axios.put(`${USER_API_URL}/notifications/markAsRead/${notificationId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};