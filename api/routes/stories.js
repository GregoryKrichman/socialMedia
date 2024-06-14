import express from "express";
import {
  getStories,
  addStory,
  uploadMiddleware,
} from "../controllers/story.js";

const router = express.Router();

router.get("/", getStories);
router.post("/", uploadMiddleware, addStory);

export default router;
