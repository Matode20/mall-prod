// Import required modules
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

/**
 * Middleware to validate JWT tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const validateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add the complete decoded user info to req.user
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Error:", error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

/**
 * Middleware for role-based access control
 * @param {...string} roles - Allowed roles for the route
 * @returns {Function} Middleware function
 */
export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    console.log("User role:", req.user.role); // Add this for debugging
    console.log("Allowed roles:", roles); // Add this for debugging

    // Check if user's role is included in allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Permission denied" });
    }

    // Proceed to next middleware if role is authorized
    next();
  };
