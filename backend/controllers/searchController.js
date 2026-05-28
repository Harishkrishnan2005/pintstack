import Post from "../models/Post.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import sendResponse from "../utils/sendResponse.js";

export const searchPosts = asyncHandler(async (req, res) => {
  const query = req.query.q || "";
  const posts = await Post.find({
    tenantId: req.tenantId,
    $or: [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
      { category: { $regex: query, $options: "i" } },
      { tags: { $regex: query, $options: "i" } },
    ],
  })
    .populate("user", "username profileImage")
    .limit(12)
    .sort("-createdAt");

  sendResponse(res, 200, "Post search completed.", { posts });
});

export const searchUsers = asyncHandler(async (req, res) => {
  const query = req.query.q || "";
  const users = await User.find({
    tenantId: req.tenantId,
    $or: [
      { username: { $regex: query, $options: "i" } },
      { bio: { $regex: query, $options: "i" } },
    ],
  })
    .select("username profileImage bio followers following")
    .limit(12)
    .sort("-createdAt");

  sendResponse(res, 200, "User search completed.", { users });
});
