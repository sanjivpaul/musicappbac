import mongoose, { Schema } from "mongoose";

const playlistSchema = new Schema(
  {
    playlist_name: {
      type: String,
      required: true,
      //   unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    // (FK)
    // Reference to User model (proper foreign key)
    user_id: {
      type: Schema.Types.ObjectId, // Changed to ObjectId
      ref: "User", // References the User model
      required: true,
      index: true,
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
    // Additional useful fields
    is_public: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // Include virtuals when converted to JSON
    toObject: { virtuals: true },
  }
);

// Virtual population of songs (without storing them in the playlist)
playlistSchema.virtual("songs", {
  ref: "SongPlaylist", // Reference the join model
  localField: "_id", // Field in this model
  foreignField: "playlist_id", // Field in the join model
  justOne: false,
  options: { sort: { createdAt: -1 } }, // Newest songs first
});

//   // Index for frequently queried fields
playlistSchema.index({ user_id: 1, playlist_name: 1 });

//   // Middleware to delete associated song relationships when playlist is deleted
//   playlistSchema.pre('deleteOne', { document: true }, async function(next) {
//     await mongoose.model('SongPlaylist').deleteMany({ playlist_id: this._id });
//     next();
//   });

export const Playlist = mongoose.model("Playlist", playlistSchema);
