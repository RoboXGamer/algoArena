import { db } from "../libs/db.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const userId = req.user.id;

  if (!name) {
    throw new ApiError(404, "Pls provide the name of playlist");
  }

  const playlist = await db.playlist.create({
    data: {
      name,
      description,
      userId,
    },
  });

  if (!playlist) {
    throw new ApiError(500, "Playlist not create pls try again");
  }

  res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist created successfully"));
});

export const getAllListDetails = asyncHandler(async (req, res) => {
  const playlists = await db.playlist.findMany({
    where: {
      userId: req.user.id,
    },
    include: {
      problems: {
        include: {
          problem: true,
        },
      },
    },
  });

  res
    .status(200)
    .json(new ApiResponse(200, playlists, "Playlist fetched successfully"));
});

export const getPlaylistDetails = asyncHandler(async (req, res) => {
  const playlistId = req.params.playlistId;

  if (!playlistId) {
    throw new ApiError(404, "Pls provide the playlist id");
  }

  const playlist = await db.playlist.findUnique({
    where: {
      id: playlistId,
      userId: req.user.id,
    },
    include: {
      problems: {
        include: {
          problem: true,
        },
      },
    },
  });

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});
