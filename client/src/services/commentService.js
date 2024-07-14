import { makeRequest } from "../axios";

export const getComments = async (postId) => {
  const res = await makeRequest.get("/comments", { params: { postId } });
  return res.data;
};

export const addComment = async (commentData) => {
  const res = await makeRequest.post("/comments", commentData);
  return res.data;
};

export const deleteComment = async (commentId) => {
  const res = await makeRequest.delete(`/comments/${commentId}`);
  return res.data;
};
