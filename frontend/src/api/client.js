import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://pintstack-backend.onrender.com/api",
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("pinstack_token");
  const tenantId = localStorage.getItem("pinstack_tenant") || "public";

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers["x-tenant-id"] = tenantId;
  return config;
});

export default apiClient;
