import express from "express";
import { authMiddleware, checkAdmin } from "../middlewares/auth.middleware.js";
import {
  createProblem,
  getAllProblems,
  getProblemById,
} from "../controllers/problem.controller.js";

export const problemRouter = express.Router();

problemRouter.post(
  "/create-problem",
  authMiddleware,
  checkAdmin,
  createProblem
);
problemRouter.get("/get-all-problems", authMiddleware, getAllProblems);

problemRouter.get("/get-problem/:id", authMiddleware, getProblemById);
