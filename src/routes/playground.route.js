import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { pollBatchResults, submitBatch } from "../libs/rapidApiJudge0.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const playgroundRouter = express.Router();

playgroundRouter.post(
  "/",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { code,language_id } = req.body;

    const userId = req.user.id;

    if (!userId) {
      throw new ApiError(400, "You are not authenticated");
    }

    const submission = [{
      source_code: code,
      language_id: language_id,
      stdin: "hello world",
    }];

    const submitResponse = await submitBatch(submission);
    console.log("Submit Response:", submitResponse);

    const token = [submitResponse[0].token]; // ✅ FIXED
    if (!token) {
      throw new ApiError(500, "Failed to get token from submission");
    }

    const result = await pollBatchResults(token);
    console.log("Execution Result:", result);

    return res
      .status(200)
      .json(new ApiResponse(200, result[0], "Code executed successfully"));
  })
);
