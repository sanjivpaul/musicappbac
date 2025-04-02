import express from "express";
import {
  addSong,
  addSongToPlaylist,
  adminLogin,
  adminLogout,
  adminRefreshToken,
  availableSongsInPlaylist,
  checkCurrentUser,
  createAlbum,
  createArtist,
  createPlaylist,
  createUser,
  dashboard,
  deleteAlbum,
  deleteArtist,
  deletePlaylist,
  deleteSong,
  deleteUser,
  listAlbums,
  listArtists,
  listPlaylists,
  listUsers,
  removeSongFromPlaylist,
  showAddSongForm,
  showCreateAlbumForm,
  showCreateArtistForm,
  showCreatePlaylistForm,
  showCreateUserForm,
  showEditAlbumForm,
  showEditArtistForm,
  showEditPlaylistForm,
  showEditSongForm,
  showEditUserForm,
  songsPage,
  updateAlbum,
  updateArtist,
  updatePlaylist,
  updateSong,
  updateUser,
  viewPlaylistSongs,
} from "../../controllers/admin/admin.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// Login routes
router.get("/login", (req, res) => {
  res.render("pages/auth/login", { title: "Admin Login" });
});

router.post("/login", adminLogin);

router.get("/logout", verifyJWT, adminLogout);
router.get("/refresh-token", adminRefreshToken);
router.get("/check-auth", verifyJWT, (req, res) => {
  res.status(200).json({ valid: true });
});
router.get("/api/current-user", checkCurrentUser);

// Protect all admin routes
router.use(verifyJWT);

router.get("/", dashboard);

// User routes
router.get("/users", listUsers);
router.get("/users/new", showCreateUserForm);
router.post("/users", upload.single("thumbnail"), createUser);
router.get("/users/edit/:id", showEditUserForm);
router.put("/users/:id", upload.single("thumbnail"), updateUser);
router.delete("/users/:id", deleteUser);
router.get("/songs", songsPage);
router.get("/songs/new", showAddSongForm); // This is the route you're missing

// songs
router.post(
  "/songs",
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
  addSong
);

// Delete song route
router.delete("/songs/:id", deleteSong);

// Edit song route (GET for form, PUT/POST for update)
router.get("/songs/edit/:id", showEditSongForm);
router.put("/songs/:id", updateSong); // or use router.post if you prefer

// Album routes
router.get("/albums", listAlbums);
router.get("/albums/new", showCreateAlbumForm);
router.post("/albums", upload.single("thumbnail"), createAlbum);
router.get("/albums/edit/:id", showEditAlbumForm);
router.put("/albums/:id", upload.single("thumbnail"), updateAlbum);
router.delete("/albums/:id", deleteAlbum);

// Artist routes
router.get("/artists", listArtists);
router.get("/artists/new", showCreateArtistForm);
router.post("/artists", upload.single("thumbnail"), createArtist);
router.get("/artists/edit/:id", showEditArtistForm);
router.put("/artists/:id", upload.single("thumbnail"), updateArtist);
router.delete("/artists/:id", deleteArtist);

// Playlist routes
router.get("/playlists", listPlaylists);
router.get("/playlists/new", showCreatePlaylistForm);
router.post("/playlists", upload.single("thumbnail"), createPlaylist);
router.get("/playlists/edit/:id", showEditPlaylistForm);
router.put("/playlists/:id", upload.single("thumbnail"), updatePlaylist);
router.delete("/playlists/:id", deletePlaylist);
router.get("/playlists/:id/songs", viewPlaylistSongs); // View songs in playlist
// Add/remove songs from playlist
router.get("/playlists/:id/available-songs", availableSongsInPlaylist);
router.post("/playlists/:id/songs", addSongToPlaylist);
router.delete("/playlists/:playlistId/songs/:songId", removeSongFromPlaylist);

export default router;
