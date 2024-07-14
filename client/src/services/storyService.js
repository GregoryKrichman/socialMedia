import { makeRequest } from "../axios";

export const getStories = async (userId) => {
  const res = await makeRequest.get("/stories", { params: { userId } });
  return res.data;
};

export const addStory = async (storyData) => {
  const res = await makeRequest.post("/stories", storyData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
