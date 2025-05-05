import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { createPlaylist } from '../controllers/playlist.controller.js';

export const playlistRouter = express.Router();

playlistRouter.post("/create-playlist", authMiddleware, createPlaylist);