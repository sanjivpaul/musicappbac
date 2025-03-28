import express from "express";
import {
  addSongToPlaylist,
  getPlaylistSongs,
  removeSongFromPlaylist,
} from "../../controllers/songPlaylist/songPlaylist.controller.js";

const router = express.Router();

router.post("/create", addSongToPlaylist);
// POST /api/playlists/songs
// Body: { "playlist_id": "507f1f77bcf86cd799439011", "song_id": "507f1f77bcf86cd799439012" }

router.get("/get/:playlist_id/songs", getPlaylistSongs);
// GET /api/playlists/:playlist_id/songs

router.delete("/remove/:playlist_id/songs/:song_id", removeSongFromPlaylist);
// DELETE /api/playlists/:playlist_id/songs/:song_id

export default router;
