import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  addProblemToPlaylist,
  createPlaylist,
  deletePlaylist,
  getAllListDetails,
  getPlaylistDetails,
  removeProblemFromPlaylist,
} from "../controllers/playlist.controller.js";

export const playlistRouter = express.Router();

playlistRouter.post("/create-playlist", authMiddleware, createPlaylist);

playlistRouter.get("/", authMiddleware, getAllListDetails);

playlistRouter.get("/:playlistId", authMiddleware, getPlaylistDetails);

playlistRouter.post("/:playlistId/add-problems",authMiddleware ,addProblemToPlaylist);

playlistRouter.delete("/:playlistId", authMiddleware, deletePlaylist);

playlistRouter.delete("/:playlistId/remove-problem", authMiddleware, removeProblemFromPlaylist);