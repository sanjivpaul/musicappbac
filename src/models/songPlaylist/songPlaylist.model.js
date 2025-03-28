// import mongoose, { Schema } from "mongoose";

// const songPlaylistSchema = new Schema(
//   {
//     // (FK)
//     playlist_id: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//       index: true,
//     },

//     // (FK)
//     song_id: {
//       type: String,
//       unique: true,
//       lowecase: true,
//       trim: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// export const SongPlaylist = mongoose.model("SongPlaylist", songPlaylistSchema);

import mongoose, { Schema } from "mongoose";

const songPlaylistSchema = new Schema(
  {
    playlist_id: {
      type: Schema.Types.ObjectId, // Changed to ObjectId reference
      ref: "Playlist", // References the Playlist model
      required: true,
      index: true,
    },
    song_id: {
      type: Schema.Types.ObjectId, // Changed to ObjectId reference
      ref: "Song", // References the Song model
      required: true,
      index: true,
    },
    // Adding a unique compound index to prevent duplicate entries
    // This ensures the same song can't be added multiple times to the same playlist
  },
  {
    timestamps: true,
  }
);

// Add compound index to prevent duplicate song-playlist pairs
songPlaylistSchema.index({ playlist_id: 1, song_id: 1 }, { unique: true });

export const SongPlaylist = mongoose.model("SongPlaylist", songPlaylistSchema);
