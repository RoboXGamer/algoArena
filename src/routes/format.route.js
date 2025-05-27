import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";

export const formatRouter = express.Router();

formatRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const { code, language } = req.body;

    if (!code || !language) {
      throw new ApiError(400, "code and language are required");
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const tempFilePath = path.join(
      __dirname,
      "../../public",
      `code.${getExtension(language)}`
    );
    fs.writeFileSync(tempFilePath, code);

    try {
      let formatCommand = getFormatCommand(language, tempFilePath);

      exec(formatCommand, (error, stdout, stderr) => {
        if (error) {
          console.error("Formatting error:", error);
          console.error("stderr:", stderr);
          return res
            .status(500)
            .json({ message: "Formatting failed", error: stderr });
        }

        if (language === "JAVASCRIPT") {
          return res.json({ formattedCode: stdout });
        } else {
          const formattedCode = fs.readFileSync(tempFilePath, "utf-8");
          fs.unlinkSync(tempFilePath);
          return res.json({ formattedCode });
        }
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  })
);

function getExtension(language) {
  return {
    JAVASCRIPT: "js",
    PYTHON: "py",
    CPP: "cpp",
    JAVA: "java",
  }[language];
}
function getFormatCommand(language, filePath) {
  const dockerFilePath = `/app/public/${path.basename(filePath)}`;

  switch (language) {
    case "JAVASCRIPT":
      return `docker exec formatter prettier --parser babel "${dockerFilePath}"`;
    case "PYTHON":
      return `docker exec formatter black "${dockerFilePath}" --quiet`;
    case "CPP":
      return `docker exec formatter clang-format -i "${dockerFilePath}"`;
    case "JAVA":
      return `docker exec formatter google-java-format -i "${dockerFilePath}"`;
    default:
      throw new Error("Unsupported language");
  }
}
