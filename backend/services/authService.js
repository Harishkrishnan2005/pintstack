import generateToken from "../utils/generateToken.js";

export const buildAuthPayload = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  profileImage: user.profileImage,
  bio: user.bio,
  role: user.role,
  tenantId: user.tenantId,
  followersCount: user.followers?.length || 0,
  followingCount: user.following?.length || 0,
  savedPostsCount: user.savedPosts?.length || 0,
  createdAt: user.createdAt,
});

export const issueAuthResponse = (user) => ({
  token: generateToken({
    id: user._id,
    tenantId: user.tenantId,
    role: user.role,
  }),
  user: buildAuthPayload(user),
});
