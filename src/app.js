import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import { ErrorMiddleware } from "./utils/error.js";

//extra processing
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

//plugins
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

// Routes import
import { authRouter } from "./routes/auth.route.js";
import { problemRouter } from "./routes/problem.route.js";
import { executeRouter } from "./routes/executeCode.route.js";
import { submissionRouter } from "./routes/submission.route.js";

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/problems", problemRouter);
app.use("/api/v1/execute-code", executeRouter);
app.use("/api/v1/submission", submissionRouter);
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
