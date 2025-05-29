import { db } from "../database/db.js";
import {
  getLanguageName,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const executeSubmit = asyncHandler(async (req, res) => {
  const { source_code, language_id, problemId } = req.body;

  const userId = req.user.id;
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });

  // stdin, expected_outputs

  const problem = await db.problem.findUnique({
    where: {
      id: problemId,
    },
  });

  if (!problem) {
    throw new ApiError(404, "Problem not found");
  }

  const privateInput = problem.privateTestcases.map((p) => p.input);
  const publicInput = problem.publicTestcases.map((p) => p.input);

  const privateOutput = problem.privateTestcases.map((p) => p.output);
  const publicOutput = problem.publicTestcases.map((p) => p.output);

  const stdin = [...privateInput, ...publicInput];
  const expected_outputs = [...privateOutput, ...publicOutput];

  if (
    !Array.isArray(stdin) ||
    stdin.length === 0 ||
    !Array.isArray(expected_outputs) ||
    expected_outputs.length !== stdin.length
  ) {
    throw new ApiError(400, "Invalid or Missing test cases");
  }

  const submissions = stdin.map((input) => ({
    source_code,
    language_id,
    stdin: input,
  }));
  console.log(submissions); //{source_code,language_id,stdin}

  const submitResponse = await submitBatch(submissions); // tokes array

  const tokens = submitResponse.map((res) => res.token); // tokens join kar di

  const results = await pollBatchResults(tokens); //

  let allPassed = true;

  const detailedResults = results.map((result, i) => {
    const stdout = result.stdout?.trim();
    const expected_output = expected_outputs[i]?.trim();
    const passed = stdout === expected_output;

    if (!passed) allPassed = false;

    return {
      testCase: i + 1,
      passed,
      stdout,
      expected: expected_output,
      stderr: result.stderr || null,
      compile_output: result.compile_output || null,
      status: result.status.description,
      memory: result.memory ? `${result.memory} KB` : undefined,
      time: result.time ? `${result.time} s` : undefined,
    };
  });

  const submission = await db.submission.create({
    data: {
      userId,
      problemId,
      sourceCode: source_code,
      language: getLanguageName(language_id),
      stdin: stdin.join("\n"),
      stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
      stderr: detailedResults.some((r) => r.stderr)
        ? JSON.stringify(detailedResults.map((r) => r.stderr))
        : null,
      compileOutput: detailedResults.some((r) => r.compile_output)
        ? JSON.stringify(detailedResults.map((r) => r.compile_output))
        : null,
      status: allPassed ? "Accepted" : "Wrong Answer",
      memory: detailedResults.some((r) => r.memory)
        ? JSON.stringify(detailedResults.map((r) => r.memory))
        : null,
      time: detailedResults.some((r) => r.time)
        ? JSON.stringify(detailedResults.map((r) => r.time))
        : null,
    },
  });

  if (allPassed) {
    await db.problemSolved.upsert({
      where: {
        userId_problemId: {
          userId,
          problemId,
        },
      },
      update: {},
      create: {
        userId,
        problemId,
      },
    });
  }

  const testCaseResults = detailedResults.map((result) => ({
    submissionId: submission.id,
    testCase: result.testCase,
    passed: result.passed,
    stdout: result.stdout,
    expected: result.expected,
    stderr: result.stderr,
    compileOutput: result.compile_output,
    status: result.status,
    memory: result.memory,
    time: result.time,
  }));

  await db.testCaseResult.createMany({
    data: testCaseResults,
  });

  const submissionWithTestCase = await db.submission.findUnique({
    where: {
      id: submission.id,
    },
    include: {
      testCases: true,
    },
  });

  const today = new Date();
  const startOfToday = new Date(today.setHours(0, 0, 0, 0));
  const endOfToday = new Date(today.setHours(23, 59, 59, 999));

  const existingGrid = await db.yearlyGrid.findFirst({
    where: {
      userId: user.id,
      date: {
        gte: startOfToday,
        lte: endOfToday,
      },
    },
  });

  if (!existingGrid) {
    await db.yearlyGrid.create({
      data: {
        userId: req.user.id,
        date: new Date(),
      },
    });
  }

  const yesterday = new Date(Date.now() - 86400000);
  const startOfYesterday = new Date(yesterday.setHours(0, 0, 0, 0));
  const endOfYesterday = new Date(yesterday.setHours(23, 59, 59, 999));

  const yesterdayGird = await db.yearlyGrid.findFirst({
    where: {
      userId: req.user.id,
      date: {
        gte: startOfYesterday,
        lte: endOfYesterday,
      },
    },
  });

  if (yesterdayGird) {
    await db.user.update({
      where: { id: req.user.id },
      data: {
        currentStreak: user.currentStreak + 1,
        maxStreak:
          user.currentStreak + 1 > user.maxStreak
            ? user.currentStreak + 1
            : user.maxStreak,
      },
    });
  } else {
    await db.user.update({
      where: { id: user.id },
      data: { currentStreak: 1 },
    });
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, submissionWithTestCase, "code executed successfully")
    );
});

export const executeRun = asyncHandler(async (req, res) => {
  const { source_code, language_id, problemId } = req.body;

  if (!source_code || !language_id || !problemId) {
    throw new ApiError(400, "Please provide all filed");
  }

  const userId = req.user.id;

  const problem = await db.problem.findUnique({
    where: {
      id: problemId,
    },
  });

  if (!problem) {
    throw new ApiError(404, "Problem not found");
  }

  const stdin = problem.publicTestcases.map((p) => p.input);
  const expected_outputs = problem.publicTestcases.map((p) => p.output);

  if (
    !Array.isArray(stdin) ||
    stdin.length === 0 ||
    !Array.isArray(expected_outputs) ||
    expected_outputs.length !== stdin.length
  ) {
    throw new ApiError(400, "Invalid or Missing test cases");
  }

  const submissions = stdin.map((input) => ({
    source_code,
    language_id,
    stdin: input,
  }));
  // console.log(submissions);

  const submitResponse = await submitBatch(submissions);
  // console.log(submitResponse)

  const tokens = submitResponse.map((res) => res.token);
  console.log(tokens);

  const results = await pollBatchResults(tokens);
  console.log(results);

  let allPassed = true;

  const detailedResults = results.map((result, i) => {
    console.log(result);
    const stdout = result.stdout?.trim();
    const expected_output = expected_outputs[i]?.trim();
    const passed = stdout === expected_output;

    if (!passed) allPassed = false;

    return {
      testCase: i + 1,
      passed,
      stdout,
      expected: expected_output,
      stderr: result.stderr || null,
      compile_output: result.compile_output || null,
      status: result.status.description,
      memory: result.memory ? `${result.memory} KB` : undefined,
      time: result.time ? `${result.time} s` : undefined,
    };
  });

  console.log(detailedResults);
  // const submission = await db.submission.create({
  //   data: {
  //     userId,
  //     problemId,
  //     sourceCode: source_code,
  //     language: getLanguageName(language_id),
  //     stdin: stdin.join("\n"),
  //     stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
  //     stderr: detailedResults.some((r) => r.stderr)
  //       ? JSON.stringify(detailedResults.map((r) => r.stderr))
  //       : null,
  //     compileOutput: detailedResults.some((r) => r.compile_output)
  //       ? JSON.stringify(detailedResults.map((r) => r.compile_output))
  //       : null,
  //     status: allPassed ? "Accepted" : "Wrong Answer",
  //     memory: detailedResults.some((r) => r.memory)
  //       ? JSON.stringify(detailedResults.map((r) => r.memory))
  //       : null,
  //     time: detailedResults.some((r) => r.time)
  //       ? JSON.stringify(detailedResults.map((r) => r.time))
  //       : null,
  //   },
  // });

  // if (allPassed) {
  //   await db.problemSolved.upsert({
  //     where: {
  //       userId_problemId: {
  //         userId,
  //         problemId,
  //       },
  //     },
  //     update: {},
  //     create: {
  //       userId,
  //       problemId,
  //     },
  //   });
  // }

  // const testCaseResults = detailedResults.map((result) => ({
  //   submissionId: submission.id,
  //   testCase: result.testCase,
  //   passed: result.passed,
  //   stdout: result.stdout,
  //   expected: result.expected,
  //   stderr: result.stderr,
  //   compileOutput: result.compile_output,
  //   status: result.status,
  //   memory: result.memory,
  //   time: result.time,
  // }));

  // await db.testCaseResult.createMany({
  //   data: testCaseResults,
  // });

  // const submissionWithTestCase = await db.submission.findUnique({
  //   where: {
  //     id: submission.id,
  //   },
  //   include: {
  //     testCases: true,
  //   },
  // });

  return res
    .status(200)
    .json(new ApiResponse(200, detailedResults, "code executed successfully"));
});
