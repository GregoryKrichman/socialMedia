import { makeRequest } from "../axios";

export const getRelationships = async (followedUserId) => {
  const res = await makeRequest.get("/relationships", {
    params: { followedUserId },
  });
  return res.data;
};

export const addRelationship = async (userId) => {
  const res = await makeRequest.post("/relationships", { userId });
  return res.data;
};

export const deleteRelationship = async (userId) => {
  const res = await makeRequest.delete("/relationships", {
    params: { userId },
  });
  return res.data;
};
