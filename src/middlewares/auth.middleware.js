import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// -----------------------------
// Protect routes (JWT required)
// -----------------------------
export const protect = async (req, res, next) => {
  let token;

  try {
    // Check for Bearer token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (exclude password)
    const user = await User.findById(decoded.userId).select("-password -otp");
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// -----------------------------
// Authorize roles
// Usage: authorizeRoles("admin", "hotelier")
// -----------------------------
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: `Role ${req.user.role} is not allowed` });
    }
    next();
  };
};
