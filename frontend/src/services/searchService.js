import apiClient from "../api/client.js";

export const searchPostsRequest = async (q) => {
  const { data } = await apiClient.get("/search/posts", { params: { q } });
  return data;
};

export const searchUsersRequest = async (q) => {
  const { data } = await apiClient.get("/search/users", { params: { q } });
  return data;
};
