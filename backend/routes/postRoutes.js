import express from "express";
import {
  addCommentToPost,
  createPost,
  deletePost,
  getPostById,
  getPosts,
  toggleLikePost,
  toggleSavePost,
  updatePost,
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadPostImage } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPostById);
router.post("/", protect, uploadPostImage, createPost);
router.put("/:id", protect, uploadPostImage, updatePost);
router.delete("/:id", protect, deletePost);
router.put("/like/:id", protect, toggleLikePost);
router.put("/save/:id", protect, toggleSavePost);
router.post("/comment/:id", protect, addCommentToPost);

export default router;
