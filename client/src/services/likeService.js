import { makeRequest } from "../axios";

export const getLikes = async (postId) => {
  const res = await makeRequest.get("/likes", { params: { postId } });
  return res.data;
};

export const addLike = async (likeData) => {
  const res = await makeRequest.post("/likes", likeData);
  return res.data;
};

export const deleteLike = async (postId) => {
  const res = await makeRequest.delete("/likes", { params: { postId } });
  return res.data;
};
