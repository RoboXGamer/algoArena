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

export const addProblemToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body;

  if (!playlistId) {
    throw new ApiError(404, "Pls provide the playlist id");
  }

  if (!Array.isArray(problemIds) || problemIds.length === 0) {
    throw new ApiError(400, "Invalid or missing problemIds");
  }

  const problemInPlaylist = await db.problemInPlaylist.createMany({
    data: problemIds.map((problemId) => ({
      playlistId,
      problemId,
    })),
  });

  if (!problemInPlaylist) {
    throw new ApiError(
      500,
      "Not able to put this problems in this playlist pls try again"
    );
  }

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        problemInPlaylist,
        "Problems added to playlist successfully"
      )
    );
});

export const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!playlistId) {
    throw new ApiError(404, "Pls provide the playlist id");
  }

  const playlist = await db.playlist.findUnique({
    where:{
      id: playlistId,
    }
  });

  if(playlist.userId !== req.user.id){
    throw new ApiError(404,"You are not authorized to delete playlist");
  }
  
  const deletedPlaylist = await db.playlist.delete({
    where: {
      id: playlistId,
    },
  });

  if (!deletedPlaylist) {
    throw new ApiError(500, "deletion have some problem try after some time");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, deletePlaylist, "Playlist deleted successfully")
    );
});
