import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import UsersPage from "./pages/users/UserPage";
import SongsPage from "./pages/songs/SongsPage";
import { useSelector } from "react-redux";
import ArtistPage from "./pages/artists/ArtistPage";
import AddArtistPage from "./pages/artists/AddArtistPage";
import EditArtistPage from "./pages/artists/EditArtistPage";
import AlbumsPage from "./pages/album/AlbumPage";
import PlaylistPage from "./pages/playlist/PlaylistPage";
import AddSongPage from "./pages/songs/AddSongPage";

function App() {
  const user = useSelector((state) => state.auth.user);
  // console.log("user===>", user);

  return (
    <>
      <Routes>
        {/* <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} /> */}
        {/* Public routes */}
        <Route path="/" element={user ? <Home /> : <Login />} />
        <Route path="/signup" element={user ? <Home /> : <Signup />} />
        <Route path="/home" element={user ? <Home /> : <Login />} />
        <Route path="/users" element={user ? <UsersPage /> : <Login />} />
        <Route path="/songs" element={user ? <SongsPage /> : <Login />} />
        <Route path="/song/add" element={user ? <AddSongPage /> : <Login />} />
        <Route path="/artist" element={user ? <ArtistPage /> : <Login />} />
        <Route
          path="/artist/add"
          element={user ? <AddArtistPage /> : <Login />}
        />
        <Route
          path="/artist/edit/:id"
          element={user ? <EditArtistPage /> : <Login />}
        />
        <Route path="/album" element={user ? <AlbumsPage /> : <Login />} />
        <Route path="/playlist" element={user ? <PlaylistPage /> : <Login />} />
      </Routes>
    </>
  );
}

export default App;
