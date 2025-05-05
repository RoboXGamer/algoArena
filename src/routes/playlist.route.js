import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  createPlaylist,
  getAllListDetails,
  getPlaylistDetails,
} from "../controllers/playlist.controller.js";

export const playlistRouter = express.Router();

playlistRouter.post("/create-playlist", authMiddleware, createPlaylist);

playlistRouter.get("/", authMiddleware, getAllListDetails);

playlistRouter.get("/:playlistId", authMiddleware, getPlaylistDetails);
