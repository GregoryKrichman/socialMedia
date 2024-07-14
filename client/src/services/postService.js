import { makeRequest } from "../axios";

export const getPosts = async (userId) => {
  const res = await makeRequest.get("/posts", { params: { userId } });
  return res.data;
};

export const addPost = async (postData) => {
  const res = await makeRequest.post("/posts", postData);
  return res.data;
};

export const deletePost = async (postId) => {
  const res = await makeRequest.delete(`/posts/${postId}`);
  return res.data;
};
