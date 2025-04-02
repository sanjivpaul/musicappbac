import mongoose from "mongoose";
import { Song } from "../../models/songs/song.model.js";
import fs from "fs";
import path from "path";
import { upload } from "../../middlewares/multer.middleware.js";
import { count } from "console";

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

const createSong = async (req, res) => {
  let songFile = null;
  let thumbnailFile = null;

  try {
    const {
      song_name,
      language,
      bitrate,
      artist_id,
      album_id,
      likes,
      play_counter,
    } = req.body;

    // Check required fields
    if (!song_name || !language || !bitrate || !artist_id || !album_id) {
      return res.status(400).json({
        success: false,
        message: "All mandatory fields are required",
      });
    }

    // Check files
    if (!req.files) {
      return res.status(400).json({
        success: false,
        message: "Both song file and thumbnail are required",
      });
    }

    songFile = req.files["song"]?.[0];
    thumbnailFile = req.files["thumbnail"]?.[0];

    console.log("songFile", songFile);
    console.log("thumbnailFile", thumbnailFile);

    if (!songFile || !thumbnailFile) {
      return res.status(400).json({
        success: false,
        message: "Both song file and thumbnail are required",
      });
    }

    const newSong = await Song.create({
      song_name: song_name.toLowerCase(),
      language: language.toLowerCase(),
      bitrate: bitrate,
      artist_id: artist_id,
      album_id: album_id,
      song_path: songFile.path,
      thumbnail_path: thumbnailFile.path,
      likes: likes || "0",
      play_counter: play_counter || "0",
    });

    console.log("newSong", newSong);

    return res.status(201).json({
      success: true,
      message: "Song created successfully",
      data: newSong,
    });
  } catch (error) {
    // Clean up files if error occurred
    deleteTempFiles(songFile);
    deleteTempFiles(thumbnailFile);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: `Duplicate key error. Details: ${error.message}`,
        keyPattern: error.keyPattern, // This shows which field caused the duplicate
      });
    }

    console.error("Error creating song:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
// Get all songs
const getAllSong = async (req, res) => {
  try {
    // Add pagination (optional)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Add basic filtering (optional)
    const filter = {};
    if (req.query.artist_id) filter.artist_id = req.query.artist_id;
    if (req.query.album_id) filter.album_id = req.query.album_id;
    if (req.query.language) filter.language = req.query.language.toLowerCase();

    // Get songs with optional population of related data
    const songs = await Song.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Newest first
    // .populate('artist_id') // Uncomment if using references
    // .populate('album_id'); // Uncomment if using references

    const totalSongs = await Song.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: songs.length,
      total: totalSongs,
      page,
      pages: Math.ceil(totalSongs / limit),
      data: songs,
    });
  } catch (error) {
    console.error("Error fetching songs:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
const getSongById = async () => {};
const updateSong = async () => {};
const deleteSong = async () => {};
const getSongsByAlbum = async (req, res) => {
  try {
    const { album_id } = req.params;
    const songs = await Song.find({ album_id });

    console.log("songs===>", songs);

    return res.status(200).json({
      success: true,
      count: songs.length,
      data: songs,
    });
  } catch (error) {
    console.error("Error fetching songs by album:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const getSongsByArtist = async (req, res) => {
  try {
    const { artist_id } = req.params;
    const songs = await Song.find({ artist_id });

    console.log("songs by artist===>", songs);

    return res.status(200).json({
      success: true,
      count: songs.length,
      data: songs,
    });
  } catch (error) {
    console.error("Error fetching songs by artist:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export {
  createSong,
  getAllSong,
  getSongById,
  updateSong,
  deleteSong,
  getSongsByAlbum,
  getSongsByArtist,
};
