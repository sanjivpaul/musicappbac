import fs from "fs";
import path from "path";
import { Artist } from "../../models/artist/artist.model.js";
import mongoose from "mongoose";

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

const createArtist = async (req, res) => {
  let thumbnailFile = null;
  let picturesFile = null;

  try {
    const { artist_name, country_of_origin, category, play_counter, likes } =
      req.body;

    console.log(req.body);

    // Check required fields
    if (!artist_name || !category) {
      return res.status(400).json({
        success: false,
        message: "Artist name and category are required fields",
      });
    }

    // Check if files were uploaded
    if (!req.files) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail image is required",
      });
    }

    thumbnailFile = req.files["thumbnail"]?.[0];
    picturesFile = req.files["thumbnail"]?.[0];
    // picturesFile = req.files["pictures"]?.[0]; // Optional

    if (!thumbnailFile) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail image is required",
      });
    }

    // Create new artist document
    const newArtist = await Artist.create({
      artist_name: artist_name.toLowerCase(),
      country_of_origin: country_of_origin?.toLowerCase(),
      category: category.toLowerCase(),
      play_counter: play_counter || "0",
      likes: likes || "0",
      thumbnail_path: thumbnailFile.path,
      pictures_path: picturesFile?.path || null,
    });

    return res.status(201).json({
      success: true,
      message: "Artist created successfully",
      data: newArtist,
    });
  } catch (error) {
    // Clean up files if error occurred
    deleteTempFiles(thumbnailFile);
    deleteTempFiles(picturesFile);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Artist with this name already exists",
      });
    }

    console.error("Error creating artist:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get All Artists
const getAllArtists = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filtering
    const filter = {};
    if (req.query.category) filter.category = req.query.category.toLowerCase();
    if (req.query.country)
      filter.country_of_origin = req.query.country.toLowerCase();

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

    // Search
    if (req.query.search) {
      filter.$or = [
        { artist_name: { $regex: req.query.search, $options: "i" } },
        { category: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const artists = await Artist.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort);

    const totalArtists = await Artist.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: artists.length,
      total: totalArtists,
      page,
      pages: Math.ceil(totalArtists / limit),
      data: artists,
    });
  } catch (error) {
    console.error("Error fetching artists:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get Artist by ID
const getArtistById = async (req, res) => {
  try {
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid artist ID format",
      });
    }

    const artist = await Artist.findById(req.params.id);

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: "Artist not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: artist,
    });
  } catch (error) {
    console.error("Error fetching artist:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update Artist
// const updateArtist = async (req, res) => {
//   try {
//     const { id } = req.params;
//     // const updates = req.body;

//     // Validate ID format
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid artist ID format",
//       });
//     }

//     // Start with the body fields
//     const updates = { ...req.body };

//     // Handle file upload if thumbnail is sent
//     if (req.file) {
//       updates.thumbnail_path = req.file.path;
//       updates.pictures_path = req.file.path;
//     }

//     // Convert text fields to lowercase if they exist
//     if (updates.artist_name)
//       updates.artist_name = updates.artist_name.toLowerCase();
//     if (updates.category) updates.category = updates.category.toLowerCase();
//     if (updates.country_of_origin)
//       updates.country_of_origin = updates.country_of_origin.toLowerCase();

//     const updatedArtist = await Artist.findByIdAndUpdate(id, updates, {
//       new: true,
//       runValidators: true,
//     });

//     if (!updatedArtist) {
//       return res.status(404).json({
//         success: false,
//         message: "Artist not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Artist updated successfully",
//       data: updatedArtist,
//     });
//   } catch (error) {
//     console.error("Error updating artist:", error);
//     if (error.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: "Artist with this name already exists",
//       });
//     }
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

const updateArtist = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid artist ID format",
      });
    }

    // Start with body updates
    const updates = {};

    if (req.body.artist_name) {
      updates.artist_name = req.body.artist_name.toLowerCase();
    }
    if (req.body.category) {
      updates.category = req.body.category.toLowerCase();
    }
    if (req.body.country_of_origin) {
      updates.country_of_origin = req.body.country_of_origin.toLowerCase();
    }
    if (req.body.play_counter) {
      updates.play_counter = req.body.play_counter;
    }
    if (req.body.likes) {
      updates.likes = req.body.likes;
    }

    // Handle file uploads (only update if provided)
    if (req.files) {
      if (req.files["thumbnail"]?.[0]) {
        updates.thumbnail_path = req.files["thumbnail"][0].path;
      }
      if (req.files["pictures"]?.[0]) {
        updates.pictures_path = req.files["pictures"][0].path;
      }
    } else if (req.file) {
      updates.thumbnail_path = req.file.path;
    }

    const updatedArtist = await Artist.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedArtist) {
      return res.status(404).json({
        success: false,
        message: "Artist not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Artist updated successfully",
      data: updatedArtist,
    });
  } catch (error) {
    console.error("Error updating artist:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Artist with this name already exists",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete Artist
const deleteArtist = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid artist ID format",
      });
    }

    const artist = await Artist.findByIdAndDelete(id);

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: "Artist not found",
      });
    }

    // Delete associated files
    if (artist.thumbnail_path) {
      try {
        fs.unlinkSync(path.join(process.cwd(), artist.thumbnail_path));
      } catch (err) {
        console.error("Error deleting thumbnail:", err);
      }
    }

    if (artist.pictures_path) {
      try {
        fs.unlinkSync(path.join(process.cwd(), artist.pictures_path));
      } catch (err) {
        console.error("Error deleting picture:", err);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Artist deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting artist:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export {
  createArtist,
  getAllArtists,
  getArtistById,
  updateArtist,
  deleteArtist,
};
