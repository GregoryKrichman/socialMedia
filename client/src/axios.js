import axios from "axios";

const makeRequest = axios.create({
  baseURL: "https://localhost:8801/api/",
  withCredentials: true,
});

makeRequest.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { makeRequest };
