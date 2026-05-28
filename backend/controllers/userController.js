import User from "../models/User.js";
import Post from "../models/Post.js";
import asyncHandler from "../utils/asyncHandler.js";
import sendResponse from "../utils/sendResponse.js";
import { validateProfileUpdate } from "../validators/userValidators.js";
import { destroyCloudinaryAsset } from "../services/cloudinaryService.js";
import { buildAuthPayload } from "../services/authService.js";

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
  })
    .populate([
      {
        path: "user",
        select: "username profileImage bio followers following",
      },
      {
        path: "comments.user",
        select: "username profileImage",
      },
    ])
    .sort("-createdAt");

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

export const toggleFollowUser = asyncHandler(async (req, res) => {
  if (String(req.user._id) === String(req.params.id)) {
    const error = new Error("You cannot follow your own profile.");
    error.statusCode = 400;
    throw error;
  }

  const [currentUser, targetUser] = await Promise.all([
    User.findById(req.user._id),
    User.findOne({
      _id: req.params.id,
      tenantId: req.tenantId,
    }).select("-password"),
  ]);

  if (!currentUser || !targetUser) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  const isFollowing = currentUser.following.some(
    (userId) => String(userId) === String(targetUser._id)
  );

  currentUser.following = isFollowing
    ? currentUser.following.filter((userId) => String(userId) !== String(targetUser._id))
    : [...currentUser.following, targetUser._id];

  targetUser.followers = isFollowing
    ? targetUser.followers.filter((userId) => String(userId) !== String(currentUser._id))
    : [...targetUser.followers, currentUser._id];

  await Promise.all([currentUser.save(), targetUser.save()]);

  sendResponse(res, 200, isFollowing ? "User unfollowed successfully." : "User followed successfully.", {
    user: targetUser,
    currentUser: buildAuthPayload(currentUser),
    following: !isFollowing,
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
