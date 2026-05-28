import apiClient from "../api/client.js";

export const registerRequest = async (payload) => {
  const { data } = await apiClient.post("/auth/register", payload);
  return data;
};

export const loginRequest = async (payload) => {
  const { data } = await apiClient.post("/auth/login", payload);
  return data;
};

export const getMeRequest = async () => {
  const { data } = await apiClient.get("/auth/me");
  return data;
};
