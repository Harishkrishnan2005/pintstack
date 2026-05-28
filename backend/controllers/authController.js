import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import sendResponse from "../utils/sendResponse.js";
import { issueAuthResponse } from "../services/authService.js";
import { validateLoginInput, validateRegisterInput } from "../validators/authValidators.js";

export const registerUser = asyncHandler(async (req, res) => {
  const validationError = validateRegisterInput(req.body);
  if (validationError) {
    const error = new Error(validationError);
    error.statusCode = 400;
    throw error;
  }

  const { username, password } = req.body;
  const email = req.body.email?.trim().toLowerCase();

  const existingUser = await User.findOne({ email, tenantId: req.tenantId });
  if (existingUser) {
    const error = new Error("An account already exists with this email.");
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({
    username,
    email,
    password,
    tenantId: req.tenantId,
  });

  sendResponse(res, 201, "Account created successfully.", issueAuthResponse(user));
});

export const loginUser = asyncHandler(async (req, res) => {
  const validationError = validateLoginInput(req.body);
  if (validationError) {
    const error = new Error(validationError);
    error.statusCode = 400;
    throw error;
  }

  const email = req.body.email?.trim().toLowerCase();
  const { password } = req.body;
  const user = await User.findOne({ email, tenantId: req.tenantId }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  sendResponse(res, 200, "Login successful.", issueAuthResponse(user));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  sendResponse(res, 200, "Authenticated user fetched.", {
    user: {
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      profileImage: req.user.profileImage,
      bio: req.user.bio,
      role: req.user.role,
      tenantId: req.user.tenantId,
      followersCount: req.user.followers.length,
      followingCount: req.user.following.length,
      savedPostsCount: req.user.savedPosts.length,
      createdAt: req.user.createdAt,
    },
  });
});
