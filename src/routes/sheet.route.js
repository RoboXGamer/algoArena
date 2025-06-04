import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  addProblemsToSheet,
  createSheet,
  deleteSheet,
  getAllMySheets,
  getAllPublicSheets,
  getCreatedByUser,
  getSheetById,
  getSheetDetails,
  getTopThreeSheet,
  liked,
  removeProblemFromSheet,
  updateSheet,
} from "../controllers/sheet.controller.js";

export const sheetRouter = express.Router();

sheetRouter.post("/create-sheet", authMiddleware, createSheet);
sheetRouter.post("/update-sheet/:sheetId", authMiddleware, updateSheet);

sheetRouter.get("/public", authMiddleware, getAllPublicSheets);
sheetRouter.get("/my-sheets", authMiddleware, getAllMySheets);

sheetRouter.get("/top-three-sheet", authMiddleware, getTopThreeSheet);

sheetRouter.get("/sheet-created-by-user", authMiddleware, getCreatedByUser);

sheetRouter.post("/liked", authMiddleware, liked);

sheetRouter.get("/get-sheet-by-id/:sheetId", authMiddleware, getSheetById);
sheetRouter.post(
  "/:sheetId/remove-problem",
  authMiddleware,
  removeProblemFromSheet
);
sheetRouter.post("/:sheetId/add-problems", authMiddleware, addProblemsToSheet);

sheetRouter.get("/:sheetId", authMiddleware, getSheetDetails);
sheetRouter.delete("/:sheetId", authMiddleware, deleteSheet);
