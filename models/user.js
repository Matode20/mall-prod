import mongoose from "mongoose";

const User = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["cashier", "admin", "superadmin"],
      default: "cashier",
    },
    branch: { type: String, required: true },
  },
  { timestamps: true }
);

export default User;
