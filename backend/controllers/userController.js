import User from "../models/User.js";
import Post from "../models/Post.js";
import asyncHandler from "../utils/asyncHandler.js";
import sendResponse from "../utils/sendResponse.js";
import { validateProfileUpdate } from "../validators/userValidators.js";
import { destroyCloudinaryAsset } from "../services/cloudinaryService.js";

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    _id: req.params.id,
    tenantId: req.tenantId,
  })
    .select("-password")
    .populate("savedPosts");

  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  const posts = await Post.find({
    user: user._id,
    tenantId: req.tenantId,
  }).sort("-createdAt");

  sendResponse(res, 200, "User profile fetched.", { user, posts });
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const validationError = validateProfileUpdate(req.body);
  if (validationError) {
    const error = new Error(validationError);
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findById(req.user._id);

  user.username = req.body.username || user.username;
  user.email = req.body.email || user.email;
  user.bio = req.body.bio ?? user.bio;

  if (req.file?.path && req.file?.filename) {
    await destroyCloudinaryAsset(user.profileImagePublicId);
    user.profileImage = req.file.path;
    user.profileImagePublicId = req.file.filename;
  }

  await user.save();

  sendResponse(res, 200, "Profile updated successfully.", {
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      profileImage: user.profileImage,
      tenantId: user.tenantId,
    },
  });
});

export const getSavedPosts = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: "savedPosts",
    populate: {
      path: "user",
      select: "username profileImage",
    },
  });

  sendResponse(res, 200, "Saved posts fetched successfully.", {
    posts: user.savedPosts,
  });
});
