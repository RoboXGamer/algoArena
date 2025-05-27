import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const userRouter = express.Router();

userRouter.post('/image',authMiddleware);
userRouter.post("/update-profile",authMiddleware);
userRouter.get('/yearly-grid',authMiddleware);
userRouter.get('/streak',authMiddleware);
userRouter.get('/total-soleved',authMiddleware);
