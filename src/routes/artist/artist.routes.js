import express from "express";
import { upload } from "../../middlewares/multer.middleware.js";
import {
  createArtist,
  deleteArtist,
  getAllArtists,
  getArtistById,
  updateArtist,
} from "../../controllers/artist/artist.controller.js";

const router = express.Router();

router.post(
  "/upload",
  upload.fields([
    // {
    //   name: "pictures",
    //   maxCount: 1,
    // },
    {
      name: "thumbnail",
      maxCount: 2,
    },
  ]),
  createArtist
);

// GET /api/artists?page=1&limit=10
router.get("/get", getAllArtists);
// GET /api/artists?category=rock
// GET /api/artists?search=john

router.get("/get/:id", getArtistById);
// GET /api/artists/507f1f77bcf86cd799439011

// router.put("/update/:id", updateArtist);
// PUT /api/artists/507f1f77bcf86cd799439011
// Body: { "category": "pop" }

router.put(
  "/update/:id",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "pictures", maxCount: 1 },
  ]),
  updateArtist
);

router.delete("/delete/:id", deleteArtist);
// DELETE /api/artists/507f1f77bcf86cd799439011

export default router;
