import { DownloadSong } from "../../models/downloadSong/downloadsong.model.js";
import { Song } from "../../models/songs/song.model.js";
import { User } from "../../models/user/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const addDownloadedSong = async (req, res) => {
  const { user_id, song_id } = req.body;

  console.log(req.body);

  try {
    const existing = await DownloadSong.findOne({
      $or: [{ user_id }, { song_id }],
    });
    // console.log("existing===>", existing);

    if (existing) {
      return res
        .status(400)
        .json({ message: "Song already downloaded by user." });
    }

    const download = await DownloadSong.create({ user_id, song_id });

    return res
      .status(201)
      .json(new ApiResponse(201, download, "Song downloaded successful"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Internal server error", error));
  }
};

const getDownloadedSong = async (req, res) => {
  const { user_id } = req.query;

  try {
    const download = await DownloadSong.find({ user_id }).populate("song_id");

    return res
      .status(201)
      .json(
        new ApiResponse(201, download, "Fetch downloaded songs successful")
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Downloaded song fetching error", error));
  }
};

const removeDownloadedSong = async (req, res) => {
  const { user_id, song_id } = req.body;

  console.log(req.body);

  try {
    const deleted = await DownloadSong.findOneAndDelete({
      $or: [{ user_id }, { song_id }],
    });

    // const deleted = await DownloadSong.findOneAndDelete({ user_id, song_id });

    if (!deleted) {
      return res.status(404).json({ message: "Download not found." });
    }

    return res
      .status(201)
      .json(
        new ApiResponse(201, deleted, "Delete downloaded songs successful")
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Deleting error on downloaded song.", error));
  }
};

export { addDownloadedSong, getDownloadedSong, removeDownloadedSong };
