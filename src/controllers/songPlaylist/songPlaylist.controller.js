import { Playlist } from "../../models/playlist/playlist.model.js";
import { SongPlaylist } from "../../models/songPlaylist/songPlaylist.model.js";
import { Song } from "../../models/songs/song.model.js";

// Add song to playlist
const addSongToPlaylist = async (req, res) => {
  try {
    const { playlist_id, song_id } = req.body;

    // Check if both playlist and song exist
    const [playlist, song] = await Promise.all([
      Playlist.findById(playlist_id),
      Song.findById(song_id),
    ]);

    if (!playlist) {
      return res
        .status(404)
        .json({ success: false, message: "Playlist not found" });
    }

    if (!song) {
      return res
        .status(404)
        .json({ success: false, message: "Song not found" });
    }

    // Create the relationship
    const songPlaylist = await SongPlaylist.create({
      playlist_id,
      song_id,
    });

    return res.status(201).json({
      success: true,
      message: "Song added to playlist successfully",
      data: songPlaylist,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "This song is already in the playlist",
      });
    }
    console.error("Error adding song to playlist:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all songs in a playlist
const getPlaylistSongs = async (req, res) => {
  try {
    // this sout be id
    const { playlist_id } = req.params;

    const songs = await SongPlaylist.find({ playlist_id })
      .populate("song_id") // Populate the song details
      .exec();

    return res.status(200).json({
      success: true,
      count: songs.length,
      data: songs.map((item) => item.song_id), // Return just the songs
    });
  } catch (error) {
    console.error("Error fetching playlist songs:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Remove song from playlist
const removeSongFromPlaylist = async (req, res) => {
  try {
    const { playlist_id, song_id } = req.params;

    const result = await SongPlaylist.findOneAndDelete({
      playlist_id,
      song_id,
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Song not found in this playlist",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Song removed from playlist successfully",
    });
  } catch (error) {
    console.error("Error removing song from playlist:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { addSongToPlaylist, getPlaylistSongs, removeSongFromPlaylist };
