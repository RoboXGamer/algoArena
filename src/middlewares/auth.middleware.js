import jwt from "jsonwebtoken";
import { db } from "../database/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { myEnvironment } from "../config/env.js";

// Middleware to check if the user is authenticated
export const authMiddleware = asyncHandler(async (req, res, next) => {
  const access_token =
    req.headers.authorization?.split(" ")[1] || req.cookies?.access_token;

  if (!access_token) {
    throw new ApiError(401, "Unauthorized request");
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(access_token, myEnvironment.ACCESS_SECRET);
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
  console.log(access_token);
  console.log(decodedToken);

  const user = await db.user.findUnique({
    where: { id: decodedToken.id },
  });

  if (user) {
    delete user.password;
    delete user.otp;
  }

  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  if (user.isVerified !== true) {
    throw new ApiError(404, "User not verified yet");
  }

  req.user = user;
  next();
});

// Middleware to check if the user is an admin
export const checkAdmin = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user || user.role !== "ADMIN") {
      throw new ApiError(403, "Forbidden");
    }

    next();
  } catch (error) {
    next(error);
  }
};
