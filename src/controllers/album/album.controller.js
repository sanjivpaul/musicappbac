import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { Album } from "../../models/album/album.model.js";

// Helper function to delete temporary files
const deleteTempFiles = (files) => {
  if (!files) return;

  try {
    if (Array.isArray(files)) {
      files.forEach((file) => {
        if (file?.path) fs.unlinkSync(file.path);
      });
    } else if (files?.path) {
      fs.unlinkSync(files.path);
    }
  } catch (error) {
    console.error("Error deleting temp files:", error);
  }
};

// Create Album
const createAlbum = async (req, res) => {
  let thumbnailFile = null;
  let picturesFile = null;

  console.log("thumbnailFile", thumbnailFile);
  console.log("picturesFile", picturesFile);

  try {
    const { album_name, artist_id, play_counter, likes, genre } = req.body;

    // console.log(req.body);

    // Check required fields
    if (!album_name || !artist_id || !genre) {
      return res.status(400).json({
        success: false,
        message: "Album name, genre and artist ID are required fields",
      });
    }

    // Check if files were uploaded if required
    if (!req.files?.thumbnail) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail image is required",
      });
    }

    thumbnailFile = req.files["thumbnail"]?.[0];
    picturesFile = req.files["thumbnail"]?.[0]; // Optional

    // Create new album document
    const newAlbum = await Album.create({
      album_name: album_name.toLowerCase(),
      artist_id: artist_id.toLowerCase(),
      genre: genre.toLowerCase(),
      play_counter: play_counter || "0",
      likes: likes || "0",
      thumbnail_path: thumbnailFile.path,
      pictures_path: picturesFile?.path || null,
    });

    return res.status(201).json({
      success: true,
      message: "Album created successfully",
      data: newAlbum,
    });
  } catch (error) {
    // Clean up files if error occurred
    deleteTempFiles(thumbnailFile);
    deleteTempFiles(picturesFile);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Album with this name already exists",
      });
    }

    console.error("Error creating album:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get All Albums
const getAllAlbums = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filtering
    const filter = {};
    if (req.query.artist_id)
      filter.artist_id = req.query.artist_id.toLowerCase();

    // Sorting (default by newest first)
    const sort = req.query.sort || { createdAt: -1 };

    // Search
    if (req.query.search) {
      filter.album_name = { $regex: req.query.search, $options: "i" };
    }

    const albums = await Album.find(filter).skip(skip).limit(limit).sort(sort);

    const totalAlbums = await Album.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: albums.length,
      total: totalAlbums,
      page,
      pages: Math.ceil(totalAlbums / limit),
      data: albums,
    });
  } catch (error) {
    console.error("Error fetching albums:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get Album by ID
const getAlbumById = async (req, res) => {
  try {
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid album ID format",
      });
    }

    const album = await Album.findById(req.params.id);

    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Album not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: album,
    });
  } catch (error) {
    console.error("Error fetching album:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update Album
const updateAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid album ID format",
      });
    }

    // Convert text fields to lowercase if they exist
    if (updates.album_name)
      updates.album_name = updates.album_name.toLowerCase();
    if (updates.artist_id) updates.artist_id = updates.artist_id.toLowerCase();

    const updatedAlbum = await Album.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedAlbum) {
      return res.status(404).json({
        success: false,
        message: "Album not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Album updated successfully",
      data: updatedAlbum,
    });
  } catch (error) {
    console.error("Error updating album:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Album with this name already exists",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete Album
const deleteAlbum = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid album ID format",
      });
    }

    const album = await Album.findByIdAndDelete(id);

    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Album not found",
      });
    }

    // Delete associated files
    if (album.thumbnail_path) {
      try {
        fs.unlinkSync(path.join(process.cwd(), album.thumbnail_path));
      } catch (err) {
        console.error("Error deleting thumbnail:", err);
      }
    }

    if (album.pictures_path) {
      try {
        fs.unlinkSync(path.join(process.cwd(), album.pictures_path));
      } catch (err) {
        console.error("Error deleting picture:", err);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Album deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting album:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export { createAlbum, getAllAlbums, getAlbumById, updateAlbum, deleteAlbum };
