import { db } from "../libs/db.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAllSubmission = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const submissions = await db.submission.findMany({
    where: {
      userId: userId,
    },
  });

  res
    .status(200)
    .json(
      new ApiResponse(200, submissions, "Submissions fetched successfully")
    );
});

export const getSubmissionsForProblem = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const problemId = req.params.problemId;
  const submissions = await db.submission.findMany({
    where: {
      userId,
      problemId,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, submissions, "Fetch submissions successfully"));
});

export const getAllTheSubmissionsForProblem = asyncHandler(async (req, res) => {
  const problemId = req.params.problemId;
  const submission = await db.submission.count({
    where: {
      problemId,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, submission, "Submissions fetched successfully"));
});
