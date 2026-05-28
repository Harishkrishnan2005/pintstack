import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    const error = new Error("Not authorized, token missing.");
    error.statusCode = 401;
    throw error;
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findOne({
    _id: decoded.id,
    tenantId: decoded.tenantId,
  }).select("-password");

  if (!user) {
    const error = new Error("User not found for this token.");
    error.statusCode = 401;
    throw error;
  }

  req.user = user;
  next();
});
