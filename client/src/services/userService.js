import { makeRequest } from "../axios";

export const getUser = async (userId) => {
  const res = await makeRequest.get(`/users/find/${userId}`);
  return res.data;
};

export const updateUser = async (userData) => {
  const res = await makeRequest.put("/users", userData);
  return res.data;
};

export const getSuggestedUsers = async () => {
  const res = await makeRequest.get("/users/suggestions");
  return res.data;
};

export const getLatestActivities = async () => {
  const res = await makeRequest.get("/users/latestActivities");
  return res.data;
};

export const getOnlineFriends = async () => {
  const res = await makeRequest.get("/users/onlineFriends");
  return res.data;
};
