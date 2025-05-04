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

export const updateProblem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // checking ownership of the problem
  const problem = await db.problem.findUnique({
    where: {
      id,
    },
  });

  if (!problem) {
    throw new ApiError(404, "Problem not found");
  }

  if (problem.userId !== req.user.id) {
    throw new ApiError(403, "Forbidden");
  }

  // get all data from the request
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    hints,
    editorial,
    testcases,
    codeSnippets,
    referenceSolutions, // this is important
  } = req.body;

  // judge0 check
  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        throw new ApiError(400, "language not supported");
      }

      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionsResults = await submitBatch(submissions);

      const tokens = submissionsResults.map((res) => res.token);

      const results = await pollBatchResults(tokens);

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
  } catch (error) {
    throw new ApiError(400, `Testcase failed for language ${language}`);
  }

  // update the problem
  const updatedProblem = await db.problem.update({
    where: {
      id,
    },
    data: {
      title: title || problem.title,
      description: description || problem.description,
      difficulty: difficulty || problem.difficulty,
      tags: tags || problem.tags,
      examples: examples || problem.examples,
      constraints: constraints || problem.constraints,
      hints: hints || problem.hints,
      editorial: editorial || problem.editorial,
      testcases: testcases || problem.testcases,
      codeSnippets: codeSnippets || problem.codeSnippets,
      referenceSolutions: referenceSolutions || problem.referenceSolutions,
    },
  });

  if (!updatedProblem) {
    throw new ApiError(404, "Error while updating problem");
  }
  // return the updated problem
  return res
    .status(200)
    .json(new ApiResponse(200, updatedProblem, "Problem updated successfully"));
});

export const deleteProblem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const problem = await db.problem.findUnique({
    where: {
      id,
    },
  });

  if (!problem) {
    throw new ApiError(404, "Problem not found");
  }

  if (problem.userId !== req.user.id) {
    throw new ApiError(403, "Forbidden");
  }

  await db.problem.delete({
    where: {
      id,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Problem deleted successfully"));
});


export const getAllProblemsSolvedByUser = asyncHandler(async (req, res) => {
  
})