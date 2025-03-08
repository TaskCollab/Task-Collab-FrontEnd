import axios from "axios";
import { TASK_API_URL } from "../Utils/Constants";

export const getUserTickets = async () => {
  const token = localStorage.getItem("authToken");
  const response = await axios.get(`${TASK_API_URL}/my-tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
