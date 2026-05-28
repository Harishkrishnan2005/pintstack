import apiClient from "../api/client.js";

export const getPostsRequest = async (params) => {
  const { data } = await apiClient.get("/posts", { params });
  return data;
};

export const getPostRequest = async (id) => {
  const { data } = await apiClient.get(`/posts/${id}`);
  return data;
};

export const createPostRequest = async (formData) => {
  const { data } = await apiClient.post("/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const updatePostRequest = async (id, formData) => {
  const { data } = await apiClient.put(`/posts/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deletePostRequest = async (id) => {
  const { data } = await apiClient.delete(`/posts/${id}`);
  return data;
};

export const toggleLikeRequest = async (id) => {
  const { data } = await apiClient.put(`/posts/like/${id}`);
  return data;
};

export const toggleSaveRequest = async (id) => {
  const { data } = await apiClient.put(`/posts/save/${id}`);
  return data;
};

export const addCommentRequest = async (id, payload) => {
  const { data } = await apiClient.post(`/posts/comment/${id}`, payload);
  return data;
};
