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
