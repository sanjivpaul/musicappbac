import mongoose from "mongoose";
import { Song } from "../../models/songs/song.model.js";

const createSong = async () => {
  try {
  } catch (error) {
    console.error("Error create song:", error);
    return res
      .status(500)
      .send({ message: "Internal Server Error On create song" });
  }
};
const getAllSong = async () => {};
const getSongById = async () => {};
const updateSong = async () => {};
const deleteSong = async () => {};

export { createSong, getAllSong, getSongById, updateSong, deleteSong };
