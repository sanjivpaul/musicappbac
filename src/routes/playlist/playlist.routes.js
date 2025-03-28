import express from "express";
import {
  createPlaylist,
  deletePlaylist,
  getAllPlaylists,
  getPlaylistById,
  updatePlaylist,
} from "../../controllers/playlist/playlist.controller.js";

const router = express.Router();

router.post("/create", createPlaylist);
// POST /api/playlists
// Body: {
//   "playlist_name": "My Favorites",
//   "user_id": "507f1f77bcf86cd799439011",
//   "description": "All my favorite songs",
//   "is_public": true
// }

router.get("/get", getAllPlaylists);
// GET /api/playlists?page=1&limit=10&user_id=507f1f77bcf86cd799439011&search=favorites&sort=createdAt:desc

// Get single playlist
router.get("/get/:id", getPlaylistById);
// GET /api/playlists/507f1f77bcf86cd799439011

// Update playlist
router.put("/update/:id", updatePlaylist);
// PUT /api/playlists/507f1f77bcf86cd799439011
// Body: {
//   "description": "Updated description",
//   "is_public": false
// }

// Delete playlist
router.delete("/delete/:id", deletePlaylist);
// DELETE /api/playlists/507f1f77bcf86cd799439011

export default router;
