import express from "express";
import { authMiddleware, checkAdmin } from "../middlewares/auth.middleware.js";
import {
  createProblem,
  deleteProblem,
  getAllProblems,
  getAllProblemsCreatedByUser,
  getAllProblemsSolvedByUser,
  getProblemById,
  updateProblem,
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

problemRouter.put(
  "/update-problem/:id",
  authMiddleware,
  checkAdmin,
  updateProblem
);

problemRouter.delete(
  "/delete-problem/:id",
  authMiddleware,
  checkAdmin,
  deleteProblem
);

problemRouter.get(
  "/get-solved-problems",
  authMiddleware,
  getAllProblemsSolvedByUser
);

problemRouter.get(
  "/problem-created-by-user",
  authMiddleware,
  getAllProblemsCreatedByUser
);
