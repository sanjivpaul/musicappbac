import { Album } from "../../models/album/album.model.js";
import { Artist } from "../../models/artist/artist.model.js";
import { Playlist } from "../../models/playlist/playlist.model.js";
import { SongPlaylist } from "../../models/songPlaylist/songPlaylist.model.js";
import { Song } from "../../models/songs/song.model.js";
import { User } from "../../models/user/user.model.js";

const adminLogin = async (req, res) => {
  console.log("Called login user");
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/admin/login");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/admin/login");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Update refresh token in DB
    user.refresh_token = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    req.flash("success", "Login successful");
    res.redirect("/admin");
  } catch (error) {
    console.error("Login error:", error);
    req.flash("error", "Login failed");
    res.redirect("/admin/login");
  }
};

const adminLogout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      { $unset: { refresh_token: 1 } },
      { new: true }
    );

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    req.flash("success", "Logged out successfully");
    res.redirect("/admin/login");
  } catch (error) {
    console.error("Logout error:", error);
    req.flash("error", "Logout failed");
    res.redirect("/admin");
  }
};

const adminRefreshToken = async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      return res.status(401).redirect("/admin/login");
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken._id);

    if (!user || incomingRefreshToken !== user.refresh_token) {
      return res.status(401).redirect("/admin/login");
    }

    const accessToken = user.generateAccessToken();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.redirect("back");
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(401).redirect("/admin/login");
  }
};
// const checkCurrentUser = async (req, res) => {
//   try {
//     // Verify access token from cookies
//     const token =
//       req.cookies.accessToken || req.headers["authorization"]?.split(" ")[1];

//     if (!token) {
//       return res.status(401).json({ error: "Not authenticated" });
//     }

//     const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//     const user = await User.findById(decoded._id).select(
//       "-password -refresh_token"
//     );

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     res.json({
//       name: user.name,
//       role: user.role,
//       avatar: user.avatar || "/images/default-avatar.jpg",
//     });
//   } catch (error) {
//     console.error("Current user error:", error);
//     res.status(401).json({ error: "Invalid token" });
//   }
// };

// Controller for current user
const checkCurrentUser = async (req, res) => {
  try {
    console.log("\n===== Request Details =====");
    console.log("Headers:", req.headers);
    console.log("Cookies:", req.cookies);
    console.log("Signed Cookies:", req.signedCookies);
    console.log("==========================\n");

    // Get user from request (assuming verifyJWT middleware adds it)
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Return user data (excluding sensitive info)
    res.json({
      name: req.user.name,
      avatar: req.user.avatar || "/images/admin-avatar.jpg",
      // For debugging - include some request info in response
      _debug: {
        headers: req.headers,
        cookies: req.cookies,
      },
    });
  } catch (error) {
    console.error("Current user error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
const dashboard = async (req, res) => {
  res.render("index", {
    title: "Admin Dashboard",
    // layout: "index",
  });
};

// List all users
const listUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0, refresh_token: 0 }); // Exclude sensitive fields
    res.render("pages/users/list", {
      title: "Users Management",
      users,
      messages: req.flash(),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    req.flash("error", "Failed to load users");
    res.redirect("/admin");
  }
};

// Show create user form
const showCreateUserForm = async (req, res) => {
  try {
    res.render("pages/users/new", {
      title: "Create New User",
    });
  } catch (error) {
    console.error("Error loading user form:", error);
    req.flash("error", "Failed to load form");
    res.redirect("/admin/users");
  }
};

// Create new user
const createUser = async (req, res) => {
  try {
    const { user_name, email, f_name, l_name, dob, password } = req.body;
    const thumbnail = req.file ? `/uploads/users/${req.file.filename}` : null;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      user_name,
      email,
      f_name,
      l_name,
      dob,
      password: hashedPassword,
      avatar: thumbnail,
    });

    await newUser.save();
    req.flash("success", "User created successfully");
    res.redirect("/admin/users");
  } catch (error) {
    console.error("Error creating user:", error);
    req.flash("error", error.message || "Failed to create user");
    res.redirect("/admin/users/new");
  }
};

// Show edit user form
const showEditUserForm = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/admin/users");
    }

    res.render("pages/users/edit", {
      title: "Edit User",
      user,
    });
  } catch (error) {
    console.error("Error loading edit form:", error);
    req.flash("error", "Failed to load edit form");
    res.redirect("/admin/users");
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_name, email, f_name, l_name, dob } = req.body;

    const updateData = {
      user_name,
      email,
      f_name,
      l_name,
      dob,
    };

    if (req.file) {
      updateData.avatar = `/uploads/users/${req.file.filename}`;
      // TODO: Delete old avatar file if needed
    }

    // Only update password if provided
    if (req.body.password) {
      updateData.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedUser) {
      req.flash("error", "User not found");
      return res.redirect("/admin/users");
    }

    req.flash("success", "User updated successfully");
    res.redirect("/admin/users");
  } catch (error) {
    console.error("Error updating user:", error);
    req.flash("error", error.message || "Failed to update user");
    res.redirect(`/admin/users/edit/${id}`);
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      req.flash("error", "User not found");
      return res.status(404).json({ error: "User not found" });
    }

    // TODO: Delete associated avatar file if needed

    req.flash("success", "User deleted successfully");
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    console.error("Error deleting user:", error);
    req.flash("error", "Failed to delete user");
    res.status(500).json({ error: "Failed to delete user" });
  }
};

// const songsPage = async (req, res) => {
//   // You would typically fetch songs from your database here
//   // For now, we'll use dummy data
//   const songs = [
//     { id: 1, title: "Song One", artist: "Artist A", duration: "3:45" },
//     { id: 2, title: "Song Two", artist: "Artist B", duration: "4:12" },
//     { id: 3, title: "Song Three", artist: "Artist C", duration: "2:58" },
//   ];

//   res.render("pages/songs", {
//     title: "Songs Management",
//     songs,
//   });
// };

const songsPage = async (req, res) => {
  try {
    const songs = await Song.find()
      .populate("artist_id", "name") // Populate artist name
      .populate("album_id", "title"); // Populate album title
    console.log("songs===>", songs);

    res.render("pages/songs", {
      title: "Songs Management",
      songs,
    });
  } catch (error) {
    console.error("Error fetching songs:", error);
    res.status(500).render("error", { message: "Error loading songs" });
  }
};

const showAddSongForm = async (req, res) => {
  try {
    // Fetch artists and albums for dropdowns
    const artists = await Artist.find();
    const albums = await Album.find();

    res.render("pages/songs/new", {
      title: "Add New Song",
      artists,
      albums,
      messages: req.flash(), // Pass flash messages to the view
    });
  } catch (error) {
    console.error("Error loading form:", error);
    req.flash("error", "Error loading form");
    res.status(500).render("error", { message: "Error loading form" });
  }
};

// const addSong = async (req, res) => {
//   try {
//     const {
//       song_name,
//       language,
//       bitrate,
//       artist_id,
//       album_id,
//       song_path,
//       thumbnail_path,
//     } = req.body;

//     const newSong = new Song({
//       song_name,
//       language,
//       bitrate,
//       artist_id,
//       album_id,
//       song_path,
//       thumbnail_path,
//       likes: "0",
//       play_counter: "0",
//     });

//     await newSong.save();

//     req.flash("success", "Song added successfully");
//     res.redirect("/admin/songs");
//   } catch (error) {
//     console.error("Error adding song:", error);
//     req.flash("error", "Failed to add song");
//     res.redirect("/admin/songs/new");
//   }
// };

const addSong = async (req, res) => {
  try {
    const { song_name, language, bitrate, artist_id, album_id } = req.body;

    // Handle file uploads
    const song = req.files["song"] ? req.files["song"][0].path : "";
    const thumbnail = req.files["thumbnail"]
      ? req.files["thumbnail"][0].path
      : "";

    console.log("song_path===>", song);
    console.log("thumbnail_path===>", thumbnail);

    const newSong = new Song({
      song_name,
      language,
      bitrate,
      artist_id,
      album_id,
      song_path: song,
      thumbnail_path: thumbnail,
      likes: "0",
      play_counter: "0",
    });

    await newSong.save();

    req.flash("success", "Song added successfully");
    res.redirect("/admin/songs");
  } catch (error) {
    console.error("Error adding song:", error);
    req.flash("error", "Failed to add song");
    res.redirect("/admin/songs/new");
  }
};

// Delete song
const deleteSong = async (req, res) => {
  try {
    const { id } = req.params;
    await Song.findByIdAndDelete(id);
    req.flash("success", "Song deleted successfully");
    res.status(200).json({ message: "Song deleted" });
  } catch (error) {
    console.error("Error deleting song:", error);
    req.flash("error", "Failed to delete song");
    res.status(500).json({ error: "Failed to delete song" });
  }
};

// Show edit form
const showEditSongForm = async (req, res) => {
  try {
    const { id } = req.params;
    const song = await Song.findById(id);
    const artists = await Artist.find();
    const albums = await Album.find();

    if (!song) {
      req.flash("error", "Song not found");
      return res.redirect("/admin/songs");
    }

    res.render("pages/songs/edit", {
      title: "Edit Song",
      song,
      artists,
      albums,
    });
  } catch (error) {
    console.error("Error loading edit form:", error);
    req.flash("error", "Error loading edit form");
    res.redirect("/admin/songs");
  }
};

// Update song
const updateSong = async (req, res) => {
  try {
    const { id } = req.params;
    const { song_name, language, bitrate, artist_id, album_id } = req.body;

    const updatedSong = await Song.findByIdAndUpdate(
      id,
      {
        song_name,
        language,
        bitrate,
        artist_id,
        album_id,
      },
      { new: true }
    );

    if (!updatedSong) {
      req.flash("error", "Song not found");
      return res.redirect("/admin/songs");
    }

    req.flash("success", "Song updated successfully");
    res.redirect("/admin/songs");
  } catch (error) {
    console.error("Error updating song:", error);
    req.flash("error", "Failed to update song");
    res.redirect(`/admin/songs/edit/${id}`);
  }
};

// List all albums
const listAlbums = async (req, res) => {
  try {
    const albums = await Album.find().populate("artist_id", "artist_name");
    res.render("pages/albums/list", {
      title: "Albums Management",
      albums,
      messages: req.flash(),
    });
  } catch (error) {
    console.error("Error fetching albums:", error);
    req.flash("error", "Failed to load albums");
    res.redirect("/admin");
  }
};

// Show create album form
const showCreateAlbumForm = async (req, res) => {
  try {
    const artists = await Artist.find();
    const genres = [
      "pop",
      "rock",
      "hip-hop",
      "jazz",
      "classical",
      "electronic",
      "rnb",
      "country",
      "metal",
      "folk",
    ];

    res.render("pages/albums/new", {
      title: "Create New Album",
      artists,
      genres, // Make sure this is included
    });
  } catch (error) {
    console.error("Error loading album form:", error);
    req.flash("error", "Failed to load form");
    res.redirect("/admin/albums");
  }
};

// Create new album
const createAlbum = async (req, res) => {
  try {
    const { album_name, artist_id, genre, play_counter, likes } = req.body;
    const thumbnail_path = req.file
      ? `/uploads/albums/${req.file.filename}`
      : null;

    const newAlbum = new Album({
      album_name,
      artist_id,
      genre: Array.isArray(genre) ? genre : [genre],
      play_counter: play_counter || "0",
      likes: likes || "0",
      thumbnail_path,
    });

    await newAlbum.save();
    req.flash("success", "Album created successfully");
    res.redirect("/admin/albums");
  } catch (error) {
    console.error("Error creating album:", error);
    req.flash("error", error.message || "Failed to create album");
    res.redirect("/admin/albums/new");
  }
};

// Show edit album form
const showEditAlbumForm = async (req, res) => {
  try {
    const { id } = req.params;
    const album = await Album.findById(id);
    const artists = await Artist.find();
    const genres = [
      "pop",
      "rock",
      "hip-hop",
      "jazz",
      "classical",
      "electronic",
      "rnb",
      "country",
      "metal",
      "folk",
    ];

    if (!album) {
      req.flash("error", "Album not found");
      return res.redirect("/admin/albums");
    }

    res.render("pages/albums/edit", {
      title: "Edit Album",
      album,
      artists,
      genres,
    });
  } catch (error) {
    console.error("Error loading edit form:", error);
    req.flash("error", "Failed to load edit form");
    res.redirect("/admin/albums");
  }
};

// Update album
const updateAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const { album_name, artist_id, genre, play_counter, likes } = req.body;

    const updateData = {
      album_name,
      artist_id,
      genre: Array.isArray(genre) ? genre : [genre],
      play_counter,
      likes,
    };

    if (req.file) {
      updateData.thumbnail_path = `/uploads/albums/${req.file.filename}`;
      // TODO: Delete old thumbnail file if needed
    }

    const updatedAlbum = await Album.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedAlbum) {
      req.flash("error", "Album not found");
      return res.redirect("/admin/albums");
    }

    req.flash("success", "Album updated successfully");
    res.redirect("/admin/albums");
  } catch (error) {
    console.error("Error updating album:", error);
    req.flash("error", error.message || "Failed to update album");
    res.redirect(`/admin/albums/edit/${id}`);
  }
};

// Delete album
const deleteAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAlbum = await Album.findByIdAndDelete(id);

    if (!deletedAlbum) {
      req.flash("error", "Album not found");
      return res.status(404).json({ error: "Album not found" });
    }

    // TODO: Delete associated thumbnail file if needed

    req.flash("success", "Album deleted successfully");
    res.status(200).json({ message: "Album deleted" });
  } catch (error) {
    console.error("Error deleting album:", error);
    req.flash("error", "Failed to delete album");
    res.status(500).json({ error: "Failed to delete album" });
  }
};

// List all artists
const listArtists = async (req, res) => {
  try {
    const artists = await Artist.find();
    res.render("pages/artists/list", {
      title: "Artists Management",
      artists,
      messages: req.flash(),
    });
  } catch (error) {
    console.error("Error fetching artists:", error);
    req.flash("error", "Failed to load artists");
    res.redirect("/admin");
  }
};

// Show create artist form
const showCreateArtistForm = async (req, res) => {
  try {
    res.render("pages/artists/new", {
      title: "Create New Artist",
      categories: [
        "pop",
        "rock",
        "hip-hop",
        "jazz",
        "classical",
        "electronic",
        "rnb",
        "country",
        "metal",
        "folk",
      ],
    });
  } catch (error) {
    console.error("Error loading artist form:", error);
    req.flash("error", "Failed to load form");
    res.redirect("/admin/artists");
  }
};

// Create new artist
const createArtist = async (req, res) => {
  try {
    const { artist_name, country_of_origin, category, play_counter, likes } =
      req.body;
    const thumbnail_path = req.file
      ? `/uploads/artists/${req.file.filename}`
      : null;

    const newArtist = new Artist({
      artist_name,
      country_of_origin,
      category,
      play_counter: play_counter || "0",
      likes: likes || "0",
      thumbnail_path,
    });

    await newArtist.save();
    req.flash("success", "Artist created successfully");
    res.redirect("/admin/artists");
  } catch (error) {
    console.error("Error creating artist:", error);
    req.flash("error", error.message || "Failed to create artist");
    res.redirect("/admin/artists/new");
  }
};

// Show edit artist form
const showEditArtistForm = async (req, res) => {
  try {
    const { id } = req.params;
    const artist = await Artist.findById(id);

    if (!artist) {
      req.flash("error", "Artist not found");
      return res.redirect("/admin/artists");
    }

    res.render("pages/artists/edit", {
      title: "Edit Artist",
      artist,
      categories: [
        "pop",
        "rock",
        "hip-hop",
        "jazz",
        "classical",
        "electronic",
        "rnb",
        "country",
        "metal",
        "folk",
      ],
    });
  } catch (error) {
    console.error("Error loading edit form:", error);
    req.flash("error", "Failed to load edit form");
    res.redirect("/admin/artists");
  }
};

// Update artist
const updateArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const { artist_name, country_of_origin, category, play_counter, likes } =
      req.body;

    const updateData = {
      artist_name,
      country_of_origin,
      category,
      play_counter,
      likes,
    };

    if (req.file) {
      updateData.thumbnail_path = `/uploads/artists/${req.file.filename}`;
      // TODO: Delete old thumbnail file if needed
    }

    const updatedArtist = await Artist.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedArtist) {
      req.flash("error", "Artist not found");
      return res.redirect("/admin/artists");
    }

    req.flash("success", "Artist updated successfully");
    res.redirect("/admin/artists");
  } catch (error) {
    console.error("Error updating artist:", error);
    req.flash("error", error.message || "Failed to update artist");
    res.redirect(`/admin/artists/edit/${id}`);
  }
};

// Delete artist
const deleteArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedArtist = await Artist.findByIdAndDelete(id);

    if (!deletedArtist) {
      req.flash("error", "Artist not found");
      return res.status(404).json({ error: "Artist not found" });
    }

    // TODO: Delete associated thumbnail file if needed

    req.flash("success", "Artist deleted successfully");
    res.status(200).json({ message: "Artist deleted" });
  } catch (error) {
    console.error("Error deleting artist:", error);
    req.flash("error", "Failed to delete artist");
    res.status(500).json({ error: "Failed to delete artist" });
  }
};

// List all playlists
const listPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find().populate("user_id", "username");
    res.render("pages/playlists/list", {
      title: "Playlists Management",
      playlists,
      messages: req.flash(),
    });
  } catch (error) {
    console.error("Error fetching playlists:", error);
    req.flash("error", "Failed to load playlists");
    res.redirect("/admin");
  }
};

// Show create playlist form
const showCreatePlaylistForm = async (req, res) => {
  try {
    const users = await User.find();
    res.render("pages/playlists/new", {
      title: "Create New Playlist",
      users,
    });
  } catch (error) {
    console.error("Error loading playlist form:", error);
    req.flash("error", "Failed to load form");
    res.redirect("/admin/playlists");
  }
};

// Create new playlist
const createPlaylist = async (req, res) => {
  try {
    const { playlist_name, user_id, is_public, description } = req.body;
    const thumbnail_path = req.file
      ? `/uploads/playlists/${req.file.filename}`
      : null;

    const newPlaylist = new Playlist({
      playlist_name,
      user_id,
      is_public: is_public === "on",
      description,
      thumbnail_path,
    });

    await newPlaylist.save();
    req.flash("success", "Playlist created successfully");
    res.redirect("/admin/playlists");
  } catch (error) {
    console.error("Error creating playlist:", error);
    req.flash("error", error.message || "Failed to create playlist");
    res.redirect("/admin/playlists/new");
  }
};

// Show edit playlist form
// const showEditPlaylistForm = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const playlist = await Playlist.findById(id);
//     const users = await User.find();

//     if (!playlist) {
//       req.flash("error", "Playlist not found");
//       return res.redirect("/admin/playlists");
//     }

//     res.render("pages/playlists/edit", {
//       title: "Edit Playlist",
//       playlist,
//       users,
//     });
//   } catch (error) {
//     console.error("Error loading edit form:", error);
//     req.flash("error", "Failed to load edit form");
//     res.redirect("/admin/playlists");
//   }
// };

const showEditPlaylistForm = async (req, res) => {
  try {
    const { id } = req.params;
    const playlist = await Playlist.findById(id).populate("user_id");
    const users = await User.find();

    if (!playlist) {
      req.flash("error", "Playlist not found");
      return res.redirect("/admin/playlists");
    }

    res.render("pages/playlists/edit", {
      title: "Edit Playlist",
      playlist,
      users,
    });
  } catch (error) {
    console.error("Error loading edit form:", error);
    req.flash("error", "Failed to load edit form");
    res.redirect("/admin/playlists");
  }
};

// Update playlist
const updatePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const { playlist_name, user_id, is_public, description } = req.body;

    const updateData = {
      playlist_name,
      user_id,
      is_public: is_public === "on",
      description,
    };

    if (req.file) {
      updateData.thumbnail_path = `/uploads/playlists/${req.file.filename}`;
      // TODO: Delete old thumbnail file if needed
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedPlaylist) {
      req.flash("error", "Playlist not found");
      return res.redirect("/admin/playlists");
    }

    req.flash("success", "Playlist updated successfully");
    res.redirect("/admin/playlists");
  } catch (error) {
    console.error("Error updating playlist:", error);
    req.flash("error", error.message || "Failed to update playlist");
    res.redirect(`/admin/playlists/edit/${id}`);
  }
};

// Delete playlist
const deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPlaylist = await Playlist.findByIdAndDelete(id);

    if (!deletedPlaylist) {
      req.flash("error", "Playlist not found");
      return res.status(404).json({ error: "Playlist not found" });
    }

    // Delete all song associations
    await SongPlaylist.deleteMany({ playlist_id: id });

    // TODO: Delete associated thumbnail file if needed

    req.flash("success", "Playlist deleted successfully");
    res.status(200).json({ message: "Playlist deleted" });
  } catch (error) {
    console.error("Error deleting playlist:", error);
    req.flash("error", "Failed to delete playlist");
    res.status(500).json({ error: "Failed to delete playlist" });
  }
};

// View songs in playlist
const viewPlaylistSongs = async (req, res) => {
  try {
    const { id } = req.params;
    const playlist = await Playlist.findById(id).populate("user_id");

    if (!playlist) {
      req.flash("error", "Playlist not found");
      return res.redirect("/admin/playlists");
    }

    const songAssociations = await SongPlaylist.find({ playlist_id: id })
      .populate("song_id")
      .sort({ createdAt: -1 });

    res.render("pages/playlists/songs", {
      title: `Songs in ${playlist.playlist_name}`,
      playlist,
      songs: songAssociations.map((assoc) => assoc.song_id),
    });
  } catch (error) {
    console.error("Error loading playlist songs:", error);
    req.flash("error", "Failed to load playlist songs");
    res.redirect("/admin/playlists");
  }
};

// Add song to playlist
// const addSongToPlaylist = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { song_id } = req.body;

//     // Check if song is already in playlist
//     const existing = await SongPlaylist.findOne({
//       playlist_id: id,
//       song_id,
//     });

//     if (existing) {
//       return res.status(400).json({ error: "Song already in playlist" });
//     }

//     const newAssociation = new SongPlaylist({
//       playlist_id: id,
//       song_id,
//     });

//     await newAssociation.save();

//     res.status(201).json({ message: "Song added to playlist" });
//   } catch (error) {
//     console.error("Error adding song to playlist:", error);
//     res.status(500).json({ error: "Failed to add song to playlist" });
//   }
// };

const addSongToPlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const { songs } = req.body;

    // Validate input
    if (!songs || !Array.isArray(songs)) {
      return res.status(400).json({ error: "Invalid song data" });
    }

    // Check which songs are already in playlist
    const existing = await SongPlaylist.find({
      playlist_id: id,
      song_id: { $in: songs },
    });

    const existingSongIds = existing.map((e) => e.song_id.toString());
    const newSongs = songs.filter(
      (songId) => !existingSongIds.includes(songId)
    );

    if (newSongs.length === 0) {
      return res
        .status(400)
        .json({ error: "All selected songs are already in the playlist" });
    }

    // Create new associations
    const associations = newSongs.map((songId) => ({
      playlist_id: id,
      song_id: songId,
    }));

    await SongPlaylist.insertMany(associations);

    res.status(201).json({
      message: `${newSongs.length} song(s) added to playlist`,
      addedCount: newSongs.length,
    });
  } catch (error) {
    console.error("Error adding songs to playlist:", error);
    res.status(500).json({ error: "Failed to add songs to playlist" });
  }
};

// Remove song from playlist
const removeSongFromPlaylist = async (req, res) => {
  try {
    const { playlistId, songId } = req.params;

    const result = await SongPlaylist.deleteOne({
      playlist_id: playlistId,
      song_id: songId,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Song not found in playlist" });
    }

    res.status(200).json({ message: "Song removed from playlist" });
  } catch (error) {
    console.error("Error removing song from playlist:", error);
    res.status(500).json({ error: "Failed to remove song from playlist" });
  }
};

const availableSongsInPlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const { search } = req.query;

    // Get songs already in playlist
    const playlistSongs = await SongPlaylist.find({ playlist_id: id }).select(
      "song_id"
    );

    // Build query for songs not in playlist
    let query = {
      _id: { $nin: playlistSongs.map((ps) => ps.song_id) },
    };

    // Add search filter if provided
    if (search) {
      query.$or = [
        { song_name: { $regex: search, $options: "i" } },
        { "artist_id.artist_name": { $regex: search, $options: "i" } },
      ];
    }

    // Get available songs
    const songs = await Song.find(query).populate("artist_id").limit(50);

    res.json({ success: true, songs });
  } catch (error) {
    console.error("Error fetching available songs:", error);
    res.status(500).json({ error: "Failed to fetch available songs" });
  }
};

export {
  adminLogin,
  adminLogout,
  adminRefreshToken,
  checkCurrentUser,
  listUsers,
  showCreateUserForm,
  createUser,
  showEditUserForm,
  updateUser,
  deleteUser,
  dashboard,
  songsPage,
  showAddSongForm,
  addSong,
  deleteSong,
  showEditSongForm,
  updateSong,
  listAlbums,
  showCreateAlbumForm,
  createAlbum,
  showEditAlbumForm,
  updateAlbum,
  deleteAlbum,
  listArtists,
  showCreateArtistForm,
  createArtist,
  showEditArtistForm,
  updateArtist,
  deleteArtist,
  listPlaylists,
  showCreatePlaylistForm,
  createPlaylist,
  showEditPlaylistForm,
  updatePlaylist,
  deletePlaylist,
  viewPlaylistSongs,
  addSongToPlaylist,
  removeSongFromPlaylist,
  availableSongsInPlaylist,
};
