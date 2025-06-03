import exp from "constants";
import { db } from "../database/db.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createSheet = asyncHandler(async (req, res) => {
  const { name, description, visibility,tags } = req.body;

  const userId = req.user.id;

  if (!name) {
    throw new ApiError(404, "Pls provide the name of sheet");
  }

  const sheet = await db.sheet.create({
    data: {
      name,
      description,
      userId,
      visibility,
      tags
    },
  });

  const createdSheet = await db.sheet.findUnique({
    where: {
      id: sheet.id
    },
    include: {
      problems: {
        include: {
          problem: {
            select: {
              id: true,
              title: true,
              description: true,
              difficulty: true,
              tags: true,
              userId: true,
              examples: true,
              constraints: true,
              hints: true,
              editorial: true,
              publicTestcases: true,
              codeSnippets: true,
              referenceSolutions: true,
              createdAt: true,
              updatedAt: true,
              user: true,
              submission: true,
              solvedBy: true,
              problemsSheets: true,
            },
          },
        },
      },
    },
  })
  if (!sheet) {
    throw new ApiError(500, "sheet not create pls try again");
  }

  res
    .status(200)
    .json(new ApiResponse(200, createdSheet, "sheet created successfully"));
});

export const getAllMySheets = asyncHandler(async (req, res) => {
  const sheets = await db.sheet.findMany({
    where: {
      userId: req.user.id
    },
    include: {
      problems: {
        include: {
          problem: {
            select: {
              id: true,
              title: true,
              description: true,
              difficulty: true,
              tags: true,
              userId: true,
              examples: true,
              constraints: true,
              hints: true,
              editorial: true,
              publicTestcases: true,
              codeSnippets: true,
              referenceSolutions: true,
              createdAt: true,
              updatedAt: true,
              user: true,
              submission: true,
              solvedBy: true,
              problemsSheets: true,
            },
          },
        },
      },
    },
  });

  res
    .status(200)
    .json(new ApiResponse(200, sheets, "sheet fetched successfully"));
});

export const getAllPublicSheets = asyncHandler(async (req, res) => {
  const sheets = await db.sheet.findMany({
    where: {
      visibility: "Public",
    },
    include: {
      problems: {
        include: {
          problem: {
            select: {
              id: true,
              title: true,
              description: true,
              difficulty: true,
              tags: true,
              userId: true,
              examples: true,
              constraints: true,
              hints: true,
              editorial: true,
              publicTestcases: true,
              codeSnippets: true,
              referenceSolutions: true,
              createdAt: true,
              updatedAt: true,
              user: true,
              submission: true,
              solvedBy: true,
              problemsSheets: true,
            },
          },
        },
      },
    },
  });

  res
    .status(200)
    .json(new ApiResponse(200, sheets, "sheet fetched successfully"));
});

export const getCreatedByUser = asyncHandler(async (req, res) => {
  const sheets = await db.sheet.findMany({
    where: {
      userId: req.user.id,
    },
    include: {
      problems: {
        include: {
          problem: {
            select: {
              id: true,
              title: true,
              description: true,
              difficulty: true,
              tags: true,
              userId: true,
              examples: true,
              constraints: true,
              hints: true,
              editorial: true,
              publicTestcases: true,
              codeSnippets: true,
              referenceSolutions: true,
              createdAt: true,
              updatedAt: true,
              user: true,
              submission: true,
              solvedBy: true,
              problemsSheets: true,
            },
          },
        },
      },
    },
  });

  res
    .status(200)
    .json(new ApiResponse(200, sheets, "sheet fetched successfully"));
});

export const getTopThreeSheet = asyncHandler(async (req, res) => {
  const sheets = await db.sheet.findMany({
    where: {
      visibility: "public",
    },
    orderBy: {
      createdAt: "desc", // ✅ newest first
    },
    take: 3, // ✅ limit to top 3
    include: {
      problems: {
        include: {
          problem: {
            select: {
              id: true,
              title: true,
              description: true,
              difficulty: true,
              tags: true,
              userId: true,
              examples: true,
              constraints: true,
              hints: true,
              editorial: true,
              publicTestcases: true,
              codeSnippets: true,
              referenceSolutions: true,
              createdAt: true,
              updatedAt: true,
              user: true,
              submission: true,
              solvedBy: true,
              problemsSheets: true,
            },
          },
        },
      },
    },
  });
  console.log(sheets);
  res
    .status(200)
    .json(new ApiResponse(200, sheets, "sheet fetched successfully"));
});

export const getSheetDetails = asyncHandler(async (req, res) => {
  const sheetId = req.params.sheetId;

  if (!sheetId) {
    throw new ApiError(404, "Pls provide the sheet id");
  }

  const sheet = await db.sheet.findUnique({
    where: {
      id: sheetId,
      userId: req.user.id,
    },
    include: {
      problems: {
        include: {
          problem: {
            select: {
              id: true,
              title: true,
              description: true,
              difficulty: true,
              tags: true,
              userId: true,
              examples: true,
              constraints: true,
              hints: true,
              editorial: true,
              publicTestcases: true,
              codeSnippets: true,
              referenceSolutions: true,
              createdAt: true,
              updatedAt: true,
              user: true,
              submission: true,
              solvedBy: true,
              problemsSheets: true,
            },
          },
        },
      },
    },
  });

  if (!sheet) {
    throw new ApiError(404, "sheet not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, sheet, "sheet fetched successfully"));
});

export const addProblemsToSheet = asyncHandler(async (req, res) => {
  const { sheetId } = req.params;
  const { problemIds } = req.body;
  console.log(problemIds);

  if (!sheetId) {
    throw new ApiError(404, "Pls provide the sheet id");
  }

  if (!Array.isArray(problemIds) || problemIds.length === 0) {
    throw new ApiError(400, "Invalid or missing problemIds");
  }

  const problemInSheet = await db.problemInSheet.createMany({
    data: problemIds.map((problemId) => ({
      sheetId,
      problemId,
    })),
  });

  if (!problemInSheet) {
    throw new ApiError(
      500,
      "Not able to put this problems in this sheet pls try again"
    );
  }

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        problemInSheet,
        "Problems added to sheet successfully"
      )
    );
});

export const deleteSheet = asyncHandler(async (req, res) => {
  const { sheetId } = req.params;

  if (!sheetId) {
    throw new ApiError(404, "Pls provide the sheet id");
  }

  const sheet = await db.sheet.findUnique({
    where: {
      id: sheetId,
    },
  });

  if (sheet.userId !== req.user.id) {
    throw new ApiError(404, "You are not authorized to delete sheet");
  }

  const deletedSheet = await db.sheet.delete({
    where: {
      id: sheetId,
    },
  });

  if (!deletedSheet) {
    throw new ApiError(500, "deletion have some problem try after some time");
  }

  res
    .status(200)
    .json(new ApiResponse(200, deleteSheet, "sheet deleted successfully"));
});

export const removeProblemFromSheet = asyncHandler(async (req, res) => {
  const { sheetId } = req.params;
  const { problemIds } = req.body;
  console.log(problemIds);
  console.log("hel");

  if (!sheetId) {
    throw new ApiError(404, "Pls provide the sheet id");
  }

  if (!Array.isArray(problemIds) || problemIds.length === 0) {
    throw new ApiError(400, "Invalid or missing problemIds");
  }

  const deletedProblem = await db.problemInSheet.deleteMany({
    where: {
      sheetId,
      problemId: {
        in: problemIds,
      },
    },
  });

  if (!deletedProblem) {
    throw new ApiError(400, "Deletion have some problem pls try again");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        deletedProblem,
        "Problems removed from sheet successfully"
      )
    );
});
