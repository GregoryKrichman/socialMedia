import { makeRequest } from "../axios";

export const login = async (inputs) => {
  const res = await makeRequest.post("/auth/login", inputs);
  return res.data;
};

export const register = async (inputs) => {
  const res = await makeRequest.post("/auth/register", inputs);
  return res.data;
};

export const logout = async () => {
  await makeRequest.post("/auth/logout");
};

export const getUser = async (userId) => {
  const res = await makeRequest.get(`/users/find/${userId}`);
  return res.data;
};
