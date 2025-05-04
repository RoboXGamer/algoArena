import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { getAllSubmission } from '../controllers/submission.controller.js';

export const submissionRouter = express.Router();

submissionRouter.get("/get-all-submissions", authMiddleware, getAllSubmission);