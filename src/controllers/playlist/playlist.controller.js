// import { Playlist } from "../models/playlist.model.js";
// import { SongPlaylist } from "../models/songPlaylist.model.js";
import mongoose from "mongoose";
import { Playlist } from "../../models/playlist/playlist.model.js";

// Create Playlist
const createPlaylist = async (req, res) => {
  try {
    const { playlist_name, user_id, description, is_public } = req.body;

    // Validate required fields
    if (!playlist_name || !user_id) {
      return res.status(400).json({
        success: false,
        message: "Playlist name and user ID are required",
      });
    }

    // Check if user exists (basic validation)
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    const newPlaylist = await Playlist.create({
      playlist_name: playlist_name.toLowerCase(),
      user_id,
      description,
      is_public: is_public || false,
    });

    console.log("successfully create playlist:", newPlaylist);

    return res.status(201).json({
      success: true,
      message: "Playlist created successfully",
      data: newPlaylist,
    });
  } catch (error) {
    console.log("create playlist error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Playlist with this name already exists",
      });
    }
    console.error("Error creating playlist:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get All Playlists
const getAllPlaylists = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filtering
    const filter = {};
    if (req.query.user_id) filter.user_id = req.query.user_id;
    if (req.query.is_public) filter.is_public = req.query.is_public === "true";

    // Search
    if (req.query.search) {
      filter.playlist_name = { $regex: req.query.search, $options: "i" };
    }

    // Sorting (default by newest first)
    const sort = {};
    if (req.query.sort) {
      const sortFields = req.query.sort.split(",");
      sortFields.forEach((field) => {
        const [key, value] = field.split(":");
        sort[key] = value === "desc" ? -1 : 1;
      });
    } else {
      sort.createdAt = -1;
    }

    const playlists = await Playlist.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .populate("user_id", "username profile_pic"); // Basic user info

    const totalPlaylists = await Playlist.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: playlists.length,
      total: totalPlaylists,
      page,
      pages: Math.ceil(totalPlaylists / limit),
      data: playlists,
    });
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get Playlist by ID
const getPlaylistById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid playlist ID format",
      });
    }

    const playlist = await Playlist.findById(id)
      .populate("user_id", "username profile_pic")
      .populate({
        path: "songs",
        populate: {
          path: "song_id",
          select: "song_name thumbnail_path duration",
        },
      });

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: playlist,
    });
  } catch (error) {
    console.error("Error fetching playlist:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update Playlist
const updatePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid playlist ID format",
      });
    }

    // Convert name to lowercase if provided
    if (updates.playlist_name) {
      updates.playlist_name = updates.playlist_name.toLowerCase();
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedPlaylist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Playlist updated successfully",
      data: updatedPlaylist,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Playlist with this name already exists",
      });
    }
    console.error("Error updating playlist:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete Playlist
const deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid playlist ID format",
      });
    }

    const playlist = await Playlist.findByIdAndDelete(id);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found",
      });
    }

    // The pre-delete hook in the model will handle deleting SongPlaylist associations

    return res.status(200).json({
      success: true,
      message: "Playlist deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting playlist:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export {
  createPlaylist,
  getAllPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
};
