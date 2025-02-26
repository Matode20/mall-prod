import express from "express";
import { register, login } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { getUserProfile } from "../controllers/userController.js";
import { authorize, validateJWT } from "../middleware/validateJWT.js";

const userRouter = express.Router();

userRouter.post("/register", validateJWT, authorize('superadmin'), register); // Protect this route if only authenticated users can register
userRouter.post("/login", login);
userRouter.get("/profile", protect, getUserProfile);


export default userRouter;
