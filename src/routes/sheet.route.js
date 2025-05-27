import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  addProblemToSheet,
  createSheet,
  deleteSheet,
  getAllSheetDetails,
  getCreatedByUser,
  getSheetDetails,
  getTopThreeSheet,
  removeProblemFromSheet,
} from "../controllers/sheet.controller.js";

export const sheetRouter = express.Router();

sheetRouter.post("/create-sheet", authMiddleware, createSheet);

sheetRouter.get("/", authMiddleware, getAllSheetDetails);

sheetRouter.get("/top-three-sheet",authMiddleware,getTopThreeSheet);

sheetRouter.get("/sheet-created-by-user",authMiddleware,getCreatedByUser);

sheetRouter.get("/:sheetId", authMiddleware, getSheetDetails);

sheetRouter.post("/:sheetId/add-problems",authMiddleware ,addProblemToSheet);

sheetRouter.delete("/:sheetId", authMiddleware, deleteSheet);

sheetRouter.delete("/:sheetId/remove-problem", authMiddleware, removeProblemFromSheet);
