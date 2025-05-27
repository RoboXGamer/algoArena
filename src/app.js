import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import { ErrorMiddleware } from "./utils/error.js";

//extra processing
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

// server initialization
const app = express();

// file import
import { authRouter } from "./routes/auth.route.js";
import { problemRouter } from "./routes/problem.route.js";
import { executeRouter } from "./routes/executeCode.route.js";
import { submissionRouter } from "./routes/submission.route.js";
import { sheetRouter } from "./routes/sheet.route.js";
import { userRouter } from "./routes/user.route.js";
import { formatRouter } from "./routes/format.route.js";


//middlewares
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../", "public")));
app.use(
  cors({
    origin: ["http://localhost:5173"],
    optionsSuccessStatus: 200,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    maxAge: 86400,
  })
);
app.use(cookieParser());



// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/problems", problemRouter);
app.use("/api/v1/execute-code", executeRouter);
app.use("/api/v1/submission", submissionRouter);
app.use("/api/v1/sheets", sheetRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/format",formatRouter);

// health check route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

//unknown route
app.use("/*splat", (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`);
  err.statusCode = 404;
  next(err);
});
app.use(ErrorMiddleware);

export default app;
