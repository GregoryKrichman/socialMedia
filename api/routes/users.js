import express from "express";
import {
  getUser,
  updateUser,
  getSuggestedUsers,
  getLatestActivities,
  getOnlineFriends,
} from "../controllers/user.js";

const router = express.Router();

router.get("/find/:userId", getUser);
router.put("/", updateUser);
router.get("/suggestions", getSuggestedUsers);
router.get("/latestActivities", getLatestActivities);
router.get("/onlineFriends", getOnlineFriends);

export default router;
