import mongoose from "mongoose";
import Post from "../models/Post.js";
import User from "../models/User.js";
import APIFeatures from "../utils/apiFeatures.js";
import asyncHandler from "../utils/asyncHandler.js";
import sendResponse from "../utils/sendResponse.js";
import { destroyCloudinaryAsset } from "../services/cloudinaryService.js";
import { normalizeTags, validatePostInput } from "../validators/postValidators.js";

const postPopulate = [
  {
    path: "user",
    select: "username profileImage bio",
  },
  {
    path: "comments.user",
    select: "username profileImage",
  },
];

export const getPosts = asyncHandler(async (req, res) => {
  const query = Post.find({ tenantId: req.tenantId }).populate(postPopulate);
  const features = new APIFeatures(query, req.query)
    .search(["title", "description", "category", "tags"])
    .sort()
    .paginate();

  if (req.query.category) {
    features.query = features.query.find({ category: req.query.category });
  }

  const posts = await features.query;
  const total = await Post.countDocuments({
    tenantId: req.tenantId,
    ...(req.query.category ? { category: req.query.category } : {}),
  });

  sendResponse(
    res,
    200,
    "Posts fetched successfully.",
    { posts },
    {
      page: features.page,
      limit: features.limit,
      hasMore: features.page * features.limit < total,
      total,
    }
  );
});

export const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findOne({
    _id: req.params.id,
    tenantId: req.tenantId,
  }).populate(postPopulate);

  if (!post) {
    const error = new Error("Post not found.");
    error.statusCode = 404;
    throw error;
  }

  sendResponse(res, 200, "Post fetched successfully.", { post });
});

export const createPost = asyncHandler(async (req, res) => {
  const validationError = validatePostInput(req.body);
  if (validationError) {
    const error = new Error(validationError);
    error.statusCode = 400;
    throw error;
  }

  if (!req.file?.path || !req.file?.filename) {
    const error = new Error("An image upload is required.");
    error.statusCode = 400;
    throw error;
  }

  const post = await Post.create({
    title: req.body.title,
    description: req.body.description,
    image: req.file.path,
    imagePublicId: req.file.filename,
    category: req.body.category,
    tags: normalizeTags(req.body.tags),
    user: req.user._id,
    tenantId: req.tenantId,
  });

  const populatedPost = await Post.findById(post._id).populate(postPopulate);
  sendResponse(res, 201, "Post created successfully.", { post: populatedPost });
});

export const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findOne({
    _id: req.params.id,
    tenantId: req.tenantId,
  });

  if (!post) {
    const error = new Error("Post not found.");
    error.statusCode = 404;
    throw error;
  }

  if (String(post.user) !== String(req.user._id)) {
    const error = new Error("You can only edit your own posts.");
    error.statusCode = 403;
    throw error;
  }

  post.title = req.body.title || post.title;
  post.description = req.body.description || post.description;
  post.category = req.body.category || post.category;
  post.tags = req.body.tags ? normalizeTags(req.body.tags) : post.tags;

  if (req.file?.path && req.file?.filename) {
    await destroyCloudinaryAsset(post.imagePublicId);
    post.image = req.file.path;
    post.imagePublicId = req.file.filename;
  }

  await post.save();
  const populatedPost = await Post.findById(post._id).populate(postPopulate);

  sendResponse(res, 200, "Post updated successfully.", { post: populatedPost });
});

export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findOne({
    _id: req.params.id,
    tenantId: req.tenantId,
  });

  if (!post) {
    const error = new Error("Post not found.");
    error.statusCode = 404;
    throw error;
  }

  if (String(post.user) !== String(req.user._id)) {
    const error = new Error("You can only delete your own posts.");
    error.statusCode = 403;
    throw error;
  }

  await destroyCloudinaryAsset(post.imagePublicId);
  await Post.deleteOne({ _id: post._id });
  await User.updateMany(
    { tenantId: req.tenantId },
    { $pull: { savedPosts: post._id } }
  );

  sendResponse(res, 200, "Post deleted successfully.");
});

export const toggleLikePost = asyncHandler(async (req, res) => {
  const post = await Post.findOne({
    _id: req.params.id,
    tenantId: req.tenantId,
  });

  if (!post) {
    const error = new Error("Post not found.");
    error.statusCode = 404;
    throw error;
  }

  const hasLiked = post.likes.some((userId) => String(userId) === String(req.user._id));
  post.likes = hasLiked
    ? post.likes.filter((userId) => String(userId) !== String(req.user._id))
    : [...post.likes, req.user._id];

  await post.save();
  sendResponse(res, 200, hasLiked ? "Post unliked." : "Post liked.", { post });
});

export const toggleSavePost = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const post = await Post.findOne({
      _id: req.params.id,
      tenantId: req.tenantId,
    }).session(session);
    const user = await User.findById(req.user._id).session(session);

    if (!post || !user) {
      const error = new Error("Post or user not found.");
      error.statusCode = 404;
      throw error;
    }

    const alreadySaved = user.savedPosts.some(
      (postId) => String(postId) === String(post._id)
    );

    user.savedPosts = alreadySaved
      ? user.savedPosts.filter((postId) => String(postId) !== String(post._id))
      : [...user.savedPosts, post._id];

    post.saves = alreadySaved
      ? post.saves.filter((userId) => String(userId) !== String(user._id))
      : [...post.saves, user._id];

    await user.save({ session });
    await post.save({ session });
    await session.commitTransaction();

    sendResponse(res, 200, alreadySaved ? "Post removed from saves." : "Post saved.", {
      savedPosts: user.savedPosts,
      post,
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

export const addCommentToPost = asyncHandler(async (req, res) => {
  const post = await Post.findOne({
    _id: req.params.id,
    tenantId: req.tenantId,
  });

  if (!post) {
    const error = new Error("Post not found.");
    error.statusCode = 404;
    throw error;
  }

  if (!req.body.text?.trim()) {
    const error = new Error("Comment text is required.");
    error.statusCode = 400;
    throw error;
  }

  post.comments.unshift({
    user: req.user._id,
    text: req.body.text.trim(),
  });

  await post.save();
  const populatedPost = await Post.findById(post._id).populate(postPopulate);

  sendResponse(res, 201, "Comment added successfully.", { post: populatedPost });
});
