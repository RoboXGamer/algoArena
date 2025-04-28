import { db } from "../libs/db.js";
import {
  getJudge0LanguageId,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createProblem = asyncHandler(async (req, res) => {
  // going to get the all the data from the request
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  // going to check the user role once again
  if (req.user.role !== "ADMIN") {
    throw new ApiError(403, "Forbidden");
  }

  try {
    // loop through each ref solution for different solution
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      // get the language id from the language
      const languageId = getJudge0LanguageId(language);
      if (!languageId) {
        throw new ApiError(400, "language not supported");
      }

      // create an array of submissions
      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));
      // submit all submissions at once for one language
      const submissionsResults = await submitBatch(submissions);

      const tokens = submissionsResults.map((res) => res.token);

      const results = await pollBatchResults(tokens);
      console.log("results : ", results);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.status.id !== 3) {
          throw new ApiError(
            400,
            `Testcase ${i + 1} failed for language ${language}`
          );
        }
      }
    }

    const newProblem = await db.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testcases,
        codeSnippets,
        referenceSolutions,
        userId: req.user.id,
      },
    });

    return res
      .status(201)
      .json(new ApiResponse(201, newProblem, "Problem created successfully"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

export const getAllProblems = asyncHandler(async (req, res) => {
  const problems = await db.problem.findMany();

  if (!problems) {
    throw new ApiError(404, "No problems found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, problems, "Problems fetched successfully"));
});

export const getProblemById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const problem = await db.problem.findUnique({
    where: {
      id,
    },
  });

  if (!problem) {
    throw new ApiError(404, "Problem not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, problem, "Problem fetched successfully"));
});
