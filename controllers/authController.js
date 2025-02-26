import bcrypt from "bcryptjs";
import User from "../models/user.js";
import dotenv from "dotenv";
import generateToken from "../lib/generateToken.js";

// Load environment variables from .env file
dotenv.config();

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public (Super Admin for role assignment)
 */
export const register = async (req, res) => {
  try {
    // Extract user data from request body
    const { name, email, password, role } = req.body;

    // Role assignment validation
    // Only Super Admins can assign specific roles
    if (role && req.user.role !== "superadmin") {
      return res
        .status(403)
        .json({ message: "Only Super Admins can assign roles" });
    }

    // Check for existing user with same email
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user instance
    user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    // Extract login credentials from request body
    const { email, password } = req.body;

    // Verify user exists in database
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    // Verify password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    // Generate JWT token for authentication
    const token = generateToken(user);

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * @desc    Get user profile information
 * @route   GET /api/users/profile
 * @access  Private (requires valid JWT token)
 */
export const getUserProfile = async (req, res) => {
  try {
    // Find user by ID and exclude password from response
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
};