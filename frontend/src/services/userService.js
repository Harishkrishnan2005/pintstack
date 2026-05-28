import apiClient from "../api/client.js";

export const getUserProfileRequest = async (id) => {
  const { data } = await apiClient.get(`/users/${id}`);
  return data;
};

export const updateProfileRequest = async (formData) => {
  const { data } = await apiClient.put("/users/update", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const toggleFollowRequest = async (id) => {
  const { data } = await apiClient.put(`/users/follow/${id}`);
  return data;
};

export const getSavedPostsRequest = async () => {
  const { data } = await apiClient.get("/users/saved");
  return data;
};
