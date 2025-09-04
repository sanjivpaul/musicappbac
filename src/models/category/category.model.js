import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
  {
    category_name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    thumbnail_path: {
      type: String, // optional (you can store a file path or image URL)
    },
  },
  {
    timestamps: true,
  }
);

export const Category = mongoose.model("Category", categorySchema);
