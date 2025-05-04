import express from "express";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./utils/error.js";


const app = express();

//plugins
app.use(express.json());
app.use(cookieParser());

// Routes import
import { authRouter } from "./routes/auth.route.js";
import { problemRouter } from "./routes/problem.route.js";
import { executeRouter } from "./routes/executeCode.route.js";

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/problems", problemRouter);
app.use("/api/v1/execute-code",executeRouter)
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
