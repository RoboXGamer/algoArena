import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { executeRun, executeSubmit } from "../controllers/executeCode.controller.js";

export const executeRouter = express.Router();

executeRouter.post("/run", authMiddleware, executeRun);
executeRouter.post("/submit", authMiddleware, executeSubmit);
