import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getStreak, getTotalSolved, updateProfile, uploadImage } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

export const userRouter = express.Router();

userRouter.post('/image',authMiddleware,upload.single("image"),uploadImage);
userRouter.post("/update-profile",authMiddleware,updateProfile);
userRouter.get('/streak',authMiddleware,getStreak);
userRouter.get('/total-solved',authMiddleware,getTotalSolved);
