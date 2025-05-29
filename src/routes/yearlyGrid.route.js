import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { db } from "../database/db.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const yearlyGridRouter = express.Router();

yearlyGridRouter.get(
  "/get-years",authMiddleware,
  asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const yearlyGrids = await db.yearlyGrid.findMany({
      where: { userId },
      select: { date: true },
    });

    const years = new Set();

    yearlyGrids.forEach((entry) => {
      const year = new Date(entry.date).getFullYear();
      years.add(year);
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        Array.from(years).sort((a, b) => b - a),
        "years fetched successfully"
      )
    );
  })
);
yearlyGridRouter.get(
  "/contributions/:year",authMiddleware,
  asyncHandler(async (req, res) => {
    const { year } = req.params;
    const userId = req.user.id;

    console.log("hlelele")
    if (!year || isNaN(Number(year))) {
      throw new ApiError(400, "Invalid year");
    }

    const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${Number(year) + 1}-01-01T00:00:00.000Z`);

    const contributions = await db.yearlyGrid.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      select: { date: true },
    });

    const dates = contributions.map(
      (entry) => entry.date.toISOString().split("T")[0]
    );

    return res
      .status(200)
      .json(new ApiResponse(200, dates, "contribution get successfully"));
  })
);
