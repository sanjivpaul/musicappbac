import mongoose, { Schema } from "mongoose";

const artistSchema = new Schema(
  {
    artist_name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    country_of_origin: {
      type: String,
      lowecase: true,
      trim: true,
    },

    // (indie pop/ rock etc)
    category: {
      type: String,
      required: true,
      lowecase: true,
      trim: true,
      index: true,
    },

    // (how many times any song by this artist is played)
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



export const Artist = mongoose.model("Artist", artistSchema);
