import express from "express";
import {
  getSavedPosts,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadProfileImage } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/saved", protect, getSavedPosts);
router.get("/:id", getUserProfile);
router.put("/update", protect, uploadProfileImage, updateUserProfile);

export default router;
