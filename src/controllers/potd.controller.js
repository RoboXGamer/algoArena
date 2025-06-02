import { db } from "../database/db.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import cron from "node-cron";

export const getPotd = asyncHandler(async (req, res) => {
  const today = new Date();

  today.setHours(0, 0, 0, 0); // Set to start of the day

  const potd = await db.potd.findUnique({
    where: {
      date: today,
    },
    include: {
      problem: true, // This includes the full problem data
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, potd, "potd fetched successfully"));
});

cron.schedule("0 0 * * *", async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of the day
    const potd = await db.potd.findUnique({
      where: {
        date: today,
      },
    });
    if (potd) {
      throw new ApiError(400, "Potd already exists for today");
    }

    const totalProblems = await db.problem.count();
    const randomIndex = Math.floor(Math.random() * totalProblems);

    const randomProblem = await db.problem.findFirst({
      skip: randomIndex,
      take: 1,
    });

    if (!randomProblem) {
      throw new ApiError(404, "No problems found");
    }

    await db.potd.create({
      data: {
        date: today,
        problemId: randomProblem.id,
      },
    });
  } catch (error) {
    console.error("Error creating POTD:", error);
  }
});
