import mongoose, { Schema } from "mongoose";

const songSchema = new Schema(
  {
    song_name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    language: {
      type: String,
      required: true,
      lowecase: true,
      trim: true,
    },
    bitrate: {
      type: String,
      required: true,
      lowecase: true,
      trim: true,
      index: true,
    },

    // (FK)
    artist_id: {
      type: Schema.Types.ObjectId,
      ref: "Artist",
      required: true,
      index: true,
    },

    // (FK)
    album_id: {
      type: Schema.Types.ObjectId,
      ref: "Album",
      required: true,
      index: true,
    },

    song_path: {
      type: String, // cloudinary url or s3
      required: false,
    },
    likes: {
      type: String,
      required: false,
    },
    // (number of times the song is played)
    play_counter: {
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

export const Song = mongoose.model("Song", songSchema);
