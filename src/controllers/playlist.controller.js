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
