export const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

export const errorHandler = (err, req, res, next) => {
  if (err.name === "ZodError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: err.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
    });
  }
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: "Already exists" });
  }
  res.status(err.statusCode || 500).json({
    message: err.message || "Server error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};