import express from "express";
import { upload } from "../../middlewares/multer.middleware.js";
import {
  createAlbum,
  deleteAlbum,
  getAlbumById,
  getAllAlbums,
  updateAlbum,
} from "../../controllers/album/album.controller.js";

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
  createAlbum
);

// GET /api/artists?page=1&limit=10
router.get("/get", getAllAlbums);
// GET /api/artists?category=rock
// GET /api/artists?search=john

router.get("/get/:id", getAlbumById);
// GET /api/artists/507f1f77bcf86cd799439011

router.put("/update/:id", updateAlbum);
// PUT /api/artists/507f1f77bcf86cd799439011
// Body: { "category": "pop" }

router.delete("/delete/:id", deleteAlbum);
// DELETE /api/artists/507f1f77bcf86cd799439011

export default router;
