import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import ErrorMiddleware from "./utils/error.js";
const app = express();

//plugins
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/v1/auth", authRouter);
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
