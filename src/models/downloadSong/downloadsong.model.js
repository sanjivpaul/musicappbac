import mongoose, { Schema } from "mongoose";

const downloadSongSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    song_id: {
      type: Schema.Types.ObjectId,
      ref: "Song",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const DownloadSong = mongoose.model("DownloadSongs", downloadSongSchema);
