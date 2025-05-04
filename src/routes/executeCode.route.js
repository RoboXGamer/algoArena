import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { executeCode } from '../controllers/executeCode.controller.js';

export const executeRouter = express.Router();

executeRouter.post("/", authMiddleware, executeCode);
