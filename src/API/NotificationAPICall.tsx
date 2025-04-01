import axios from "axios";
import { NOTIFICATION_API_URL } from "../Utils/Constants";
import { Notification } from "../Utils/NotificationTypes";

export const NotificationAPI = {
  getNotifications: async (userId: number): Promise<Notification[]> => {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${NOTIFICATION_API_URL}/user/${userId}`, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },
  markAsRead: async (notificationId: number): Promise<void> => {
    const token = localStorage.getItem("authToken");
    await axios.put(`${NOTIFICATION_API_URL}/markAsRead/${notificationId}`, 
      {}, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }
};