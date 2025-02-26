import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["cashier", "admin", "superadmin"],
      default: "cashier",
    },
    branch: { type: String, required: false },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);
export default User;
