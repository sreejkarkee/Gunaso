import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) throw new ApiError(401, "Not logged in");

  const decoded = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) throw new ApiError(401, "User no longer exists");

  req.user = user;
  next();
});