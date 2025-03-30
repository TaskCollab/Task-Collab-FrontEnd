import axios from "axios";
import { TASK_API_URL } from "../Utils/Constants";

export const getTask = async (Id: number) => {
    const token = localStorage.getItem("authToken");
    console.log(Id);
    console.log(TASK_API_URL);
    console.log(token);
    try {
      const url = `${TASK_API_URL}${Id}`;
      console.log("Constructed URL:", url);
      const response = await axios.post(url, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("API response:", response);
      return response.data;
    } catch (error) {
      console.error("Error in getTask API call", error);
      throw error;
    }
  };

export const updateTask = async (taskId: number, taskData: any) => {
  const token = localStorage.getItem("authToken");
  const response = await axios.put(`${TASK_API_URL}update/${taskId}`, taskData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteTask = async (taskId: number) => {
  const token = localStorage.getItem("authToken");
  console.log(taskId);
  console.log(TASK_API_URL);
  console.log(token);
  console.log("Constructed URL:", `${TASK_API_URL}delete/${taskId}`); 
  const response = await axios.delete(`${TASK_API_URL}delete/${taskId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

//If you have a lock task function
export const lockTask = async (taskId: number) => {
  const token = localStorage.getItem("authToken");
  const response = await axios.put(`${TASK_API_URL}/${taskId}/lock`,{},{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};