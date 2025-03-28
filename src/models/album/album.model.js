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
    // Proper reference to Artist model
    artist_id: {
      type: Schema.Types.ObjectId,
      ref: "Artist",
      required: [true, "Artist reference is required"],
      index: true,
    },

    genre: {
      type: [String], // Array for multiple genres
      required: true,
      enum: {
        values: [
          "pop",
          "rock",
          "hip-hop",
          "jazz",
          "classical",
          "electronic",
          "rnb",
          "country",
          "metal",
          "folk",
        ],
        message: "Invalid genre specified",
      },
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
    toJSON: { virtuals: true }, // Include virtuals when converted to JSON
    toObject: { virtuals: true },
  }
);

export const Album = mongoose.model("Album", albumSchema);
