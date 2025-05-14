import express from "express";
import {
  check,
  forgotPassword,
  login,
  logout,
  refreshToken,
  register,
  resetPassword,
  socialAuth,
  verifyAccount,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const authRouter = express.Router();

//routes
authRouter.post("/register", register);
authRouter.post("/verify-account", verifyAccount);
authRouter.post("/login", login);
authRouter.post("/logout", authMiddleware, logout);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/refresh-token", refreshToken);
authRouter.post("/social-auth", socialAuth);
authRouter.get("/check", authMiddleware, check);
