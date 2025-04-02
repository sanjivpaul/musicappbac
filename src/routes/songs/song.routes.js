import express from "express";
import { upload } from "../../middlewares/multer.middleware.js";
import {
  createSong,
  getAllSong,
  getSongsByAlbum,
  getSongsByArtist,
} from "../../controllers/songs/song.controller.js";

const router = express.Router();

router.post(
  "/upload",
  upload.fields([
    {
      name: "song",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  createSong
);
router.get("/get", getAllSong);
// GET /api/songs
// GET /api/songs?page=2&limit=10
// GET /api/songs?artist_id=ARTIST_ID_HERE
// GET /api/songs/SONG_ID_HERE

router.get("/get/:album_id", getSongsByAlbum);
router.get("/getartist/:artist_id", getSongsByArtist);

export default router;
