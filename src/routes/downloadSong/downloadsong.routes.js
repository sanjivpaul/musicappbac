import express from "express";
import {
  addDownloadedSong,
  getDownloadedSong,
  removeDownloadedSong,
} from "../../controllers/downloadSong/downloadsong.controller.js";

const router = express.Router();

router.post("/add", addDownloadedSong);
router.get("/get", getDownloadedSong);
router.delete("/remove", removeDownloadedSong);

export default router;
