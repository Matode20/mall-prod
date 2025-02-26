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
  // Get token from request header
  const token = req.header("Authorization");

  // Check if token exists
  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  try {
    // Verify and decode the token
    // Remove 'Bearer ' prefix if present
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    // Add decoded user data to request object
    req.user = decoded;
    // Proceed to next middleware
    next();
  } catch (error) {
    // Return error if token is invalid
    res.status(401).json({ message: "Invalid token" });
  }
};

/**
 * Middleware for role-based access control
 * @param {...string} roles - Allowed roles for the route
 * @returns {Function} Middleware function
 */
export const authorize = (...roles) => (req, res, next) => {
  // Check if user's role is included in allowed roles
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Permission denied" });
  }
  // Proceed to next middleware if role is authorized
  next();
};
