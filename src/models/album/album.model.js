import mongoose, { Schema } from "mongoose";

const albumSchema = new Schema(
  {
    album_name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    // (FK)
    artist_id: {
      type: String,
      unique: true,
      lowecase: true,
      trim: true,
    },

    // (how many times any song in the album is played)
    play_counter: {
      type: String,
      required: false,
    },

    likes: {
      type: String,
      required: false,
    },

    thumbnail_path: {
      type: String,
    },

    pictures_path: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Album = mongoose.model("Album", albumSchema);
