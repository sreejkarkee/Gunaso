import { ApiError } from "../utils/apiError.js";

export const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    throw new ApiError(403, "You do not have permission to do this");
  }
  next();
};