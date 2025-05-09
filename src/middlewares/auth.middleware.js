import jwt from "jsonwebtoken";
import { db } from "../database/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { myEnvironment } from "../config/env.js";

// Middleware to check if the user is authenticated
export const authMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new ApiError(401, "Unauthorized");
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, myEnvironment.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const user = await db.user.findUnique({
    where: { id: decodedToken.id },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!user) {
    throw new ApiError(404, "Unauthorized");
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
